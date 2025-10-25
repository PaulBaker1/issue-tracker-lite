namespace IssueTracker.Api.Features.Issues;

using IssueTracker.Api.Common;
using Microsoft.AspNetCore.Mvc;
using IssueTracker.Api.Common;
using IssueTracker.Api.Features.Issues;
    public static class IssueEndpoints
    {
        public static IEndpointRouteBuilder MapIssueEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/issues").WithTags("Issues");


            group.MapGet("", async (IssueService svc, string? q, string? status) =>
            {
                var items = await svc.ListAsync(q, status);
                return TypedResults.Ok(items.Select(x => x.ToDto()));
            });


            group.MapGet("/{id:int}", async Task<Results<Ok<IssueDtos.IssueDto>, NotFound>> (IssueService svc, int id) =>
            {
                var e = await svc.GetAsync(id);
                return e is null ? TypedResults.NotFound() : TypedResults.Ok(e.ToDto());
            });


            group.MapPost("", async Task<Results<Created<IssueDtos.IssueDto>, BadRequest<ProblemDetails>>>
                (IssueService svc, [FromBody] IssueDtos.IssueUpsertDto dto) =>
            {
                var (ok, err) = IssueValidators.Validate(dto);
                if (!ok) return TypedResults.BadRequest(Api.Problem("Validation failed", err!, 400));
            
                var created = await svc.CreateAsync(dto);
                return TypedResults.Created($"/api/issues/{created.Id}", created.ToDto());
            });
            
            group.MapPut("/{id:int}", async Task<Results<Ok<IssueDtos.IssueDto>, NotFound, BadRequest<ProblemDetails>>>
                (IssueService svc, int id, [FromBody] IssueDtos.IssueUpsertDto dto) =>
            {
                var (ok, err) = IssueValidators.Validate(dto);
                if (!ok) return TypedResults.BadRequest(Api.Problem("Validation failed", err!, 400));
            
                var updated = await svc.UpdateAsync(id, dto);
                if (updated is null) return TypedResults.NotFound();
                return TypedResults.Ok(updated.ToDto());
            });



            group.MapDelete("/{id:int}", async Task<Results<NoContent, NotFound>> (IssueService svc, int id) =>
            {
                var removed = await svc.DeleteAsync(id);
                return removed ? TypedResults.NoContent() : TypedResults.NotFound();
            });


            return app;
        }
    }