using Aquadata.Api.Extensions;
using Aquadata.Application.UseCases.Cultivation;
using Aquadata.Application.UseCases.Cultivation.AddBiometric;
using Aquadata.Application.UseCases.Cultivation.AddObjective;
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

  [HttpPost]
  public async Task<IResult> Create([FromBody] CreateCultivationInput command
  ,CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command,cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  }

  [HttpPost("add-objective")]
  public async Task<IResult> AddObjective([FromBody] AddObjectiveInput command,
  CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  }

  [HttpPost("add-biometric")]
  public async Task<IResult> AddBiometric([FromBody] AddBiometricInput command,
  CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  }
}
