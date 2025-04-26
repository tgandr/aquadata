using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Api.Extensions;

public static class ResultExtensions
{
  public static IResult MapResult<T>(this IResultExtensions _, 
  Result<T> result)
  {
    var error = result.Error;

    return result.Error.Type switch
    {
      ErrorType.Validation => Results.BadRequest(error),
      ErrorType.Unauthorized => Results.Unauthorized(),
      ErrorType.Conflict => Results.Conflict(error),
      ErrorType.NotFound => Results.NotFound(error),
      ErrorType.Internal => Results.Problem(error.Description),
      _ => Results.Problem(
        statusCode: 500,
        title: "Server Failure",
        type: Enum.GetName(typeof(ErrorType), error.Type),
        extensions: new Dictionary<string, object?> {
          {"errors", new [] {error}}
        }
      )
    };
  }
}
