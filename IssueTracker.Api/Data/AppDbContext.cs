using Microsoft.EntityFrameworkCore;
using IssueTracker.Api.Features.Issues;

namespace IssueTracker.Api.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Issue> Issues => Set<Issue>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Issue>(b =>
            {
                b.Property(i => i.Title).HasMaxLength(120).IsRequired();
                b.Property(i => i.Priority).HasMaxLength(10).IsRequired();
                b.Property(i => i.Status).HasMaxLength(20).IsRequired();
                b.Property(i => i.CreatedAt).IsRequired();
            });
        }
    }
}