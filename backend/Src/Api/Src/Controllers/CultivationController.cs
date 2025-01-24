using Aquadata.Api.Extensions;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Cultivation;
using Aquadata.Application.UseCases.Pond.GetPond;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;


[Route("/cultivations")]
[ApiController]
[Authorize]
public class CultivationController: ControllerBase
{
  private readonly IMediator _mediator;
  public CultivationController(IMediator mediator)
    => _mediator = mediator;

  private bool IsAuthorized(Guid userId, Guid pondId)
  {
    var pondResult = _mediator.Send(new GetPondInput(pondId)).Result;

    if (pondResult.IsFail)
      return false;

    return pondResult.Unwrap().UserId == userId;
  }

  [HttpPost]
  public async Task<IResult> Create([FromBody] AddCultivationInput command
  ,CancellationToken cancellationToken)
  {
    var userId = User.FindFirst("id")!.Value;

    if (!IsAuthorized(Guid.Parse(userId), command.PondId))
      return Results.Unauthorized();

    var result = await _mediator.Send(command,cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  }
}
