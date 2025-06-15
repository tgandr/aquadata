using Aquadata.Api.Extensions;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Manager.Common;
using Aquadata.Application.UseCases.Manager.DeleteManager;
using Aquadata.Application.UseCases.Manager.GetManager;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/managers")]
[Authorize]
public class ManagerController : ControllerBase
{
  private readonly IMediator _mediator;

  public ManagerController(IMediator mediator)
  {
    _mediator = mediator;
  }

  [HttpGet("/{phone}")]
  public async Task<IResult> GetManager(string phone)
  {
    var result = await _mediator.Send(new GetManagerInput(phone));

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(new ApiResponse<ManagerOutput>(
      result.Unwrap()
    ));
  }

  [HttpDelete("/{phone}")]
  public async Task<IResult> DeleteManager([FromRoute] string phone)
  {
    var result = await _mediator.Send(new DeleteManagerInput(phone));

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.NoContent();
  }
}
