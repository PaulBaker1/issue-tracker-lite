using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Api.Features.Issues;

public class IssueDtos
{
    public record IssueUpsertDto(
        [property:Required, StringLength(120, MinimumLength = 3)] String Title,
        string? Description,
        [property: Required] string Priority,
        string? Status
    );

    public record IssueDto(
        int Id,
        string Title,
        string? Description,
        string Priority,
        string Status,
        DateTime CreatedAt
    );
}