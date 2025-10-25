namespace IssueTracker.Api.Features.Issues
{
    public static class IssueMappings
    {
        public static IssueDtos.IssueDto ToDto(this Issue e) =>
            new(e.Id, e.Title, e.Description, e.Priority, e.Status, e.CreatedAt);


        public static void Apply(this Issue e, IssueDtos.IssueUpsertDto dto)
        {
            e.Title = dto.Title;
            e.Description = dto.Description;
            e.Priority = dto.Priority.ToLowerInvariant();
            if (!string.IsNullOrWhiteSpace(dto.Status))
                e.Status = dto.Status!.ToLowerInvariant();
        }
    }
}