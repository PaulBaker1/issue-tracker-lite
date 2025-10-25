using Microsoft.AspNetCore.Mvc;

namespace IssueTracker.Api.Common
{
    public static class Api
    {
        public static ProblemDetails Problem(string title, string detail, int status) =>
            new() { Title = title, Detail = detail, Status = status, Type = "about:blank" };
    }
}
