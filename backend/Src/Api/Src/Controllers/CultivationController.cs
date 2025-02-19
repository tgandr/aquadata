using Aquadata.Api.Extensions;
using Aquadata.Api.Response;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Cultivation;
using Aquadata.Application.UseCases.Cultivation.AddBiometric;
using Aquadata.Application.UseCases.Cultivation.AddFeed;
using Aquadata.Application.UseCases.Cultivation.AddFertilizer;
using Aquadata.Application.UseCases.Cultivation.AddHarvest;
using Aquadata.Application.UseCases.Cultivation.AddObjective;
using Aquadata.Application.UseCases.Cultivation.AddWater;
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

  private async Task<IResult> SendRequest<TResponse>(IUseCaseRequest<TResponse> command, 
  CancellationToken cancellationToken) 
  {
    var result = await _mediator.Send(command,cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(
      new ApiResponse<TResponse>(result.Unwrap())
    );
  }

  [HttpPost]
  public async Task<IResult> Create([FromBody] CreateCultivationInput command,
  CancellationToken cancellationToken)
    => await SendRequest(command, cancellationToken);

  [HttpPost("add-objective")]
  public async Task<IResult> AddObjective([FromBody] AddObjectiveInput command,
  CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-biometric")]
  public async Task<IResult> AddBiometric([FromBody] AddBiometricInput command,
  CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-water-param")]
  public async Task<IResult> AddWater([FromBody] AddWaterInput command,
  CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-fertilizer")]
  public async Task<IResult> AddFertilizer([FromBody] AddFertilizerInput command,
  CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-harvest")]
  public async Task<IResult> AddHarvest([FromBody] AddHarvestInput command,
  CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-feed")]
  public async Task<IResult> AddFeed([FromBody] AddFeedInput command,
  CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);
}
