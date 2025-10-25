using IssueTracker.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace IssueTracker.Api.Features.Issues
{
    public class IssueService
    {
        private readonly AppDbContext _db;

        // IMPORTANT: public and takes AppDbContext
        public IssueService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Issue>> ListAsync(string? q, string? status)
        {
            var query = _db.Issues.AsQueryable();
            if (!string.IsNullOrWhiteSpace(q)) query = query.Where(i => i.Title.Contains(q));
            if (!string.IsNullOrWhiteSpace(status)) query = query.Where(i => i.Status == status);
            return await query.OrderByDescending(i => i.CreatedAt).ToListAsync();
        }

        public Task<Issue?> GetAsync(int id) => _db.Issues.FindAsync(id).AsTask();

        public async Task<Issue> CreateAsync(IssueDtos.IssueUpsertDto dto)
        {
            var e = new Issue { CreatedAt = DateTime.UtcNow };
            e.Apply(dto);
            _db.Issues.Add(e);
            await _db.SaveChangesAsync();
            return e;
        }

        public async Task<Issue?> UpdateAsync(int id, IssueDtos.IssueUpsertDto dto)
        {
            var e = await _db.Issues.FindAsync(id);
            if (e is null) return null;
            e.Apply(dto);
            await _db.SaveChangesAsync();
            return e;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _db.Issues.FindAsync(id);
            if (e is null) return false;
            _db.Issues.Remove(e);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}