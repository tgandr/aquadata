using Aquadata.Api.Extensions;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Manager.Common;
using Aquadata.Application.UseCases.Manager.GetManager;
using Aquadata.Core.Util;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[Route("/managers")]
[Authorize]
public class ManagerController : ControllerBase
{
  private readonly IMediator _mediator;

  public ManagerController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet("/{id}")]
  public async Task<IResult> GetManager(string id)
  {
    var result = await _mediator.Send(new GetManagerInput(id));

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(new ApiResponse<ManagerOutput>(
      result.Unwrap()
    ));
  }
}
