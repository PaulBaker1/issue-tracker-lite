using System.Linq;

namespace IssueTracker.Api.Features.Issues
{
    public static class IssueValidators
    {
        private static readonly string[] Priorities = new[] { "low", "medium", "high" };
        private static readonly string[] Statuses   = new[] { "open", "in_progress", "done" };

        public static (bool ok, string? error) Validate(IssueDtos.IssueUpsertDto dto)
        {
            var pr = dto.Priority?.ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(pr) || !Priorities.Contains(pr))
                return (false, "Priority must be one of: low|medium|high.");

            var st = dto.Status?.ToLowerInvariant();
            if (st is not null && !Statuses.Contains(st))
                return (false, "Status must be one of: open|in_progress|done.");

            return (true, null);
        }
    }
}