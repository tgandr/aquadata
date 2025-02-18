using Aquadata.Api.Extensions;
using Aquadata.Api.Response;
using Aquadata.Application.Dtos;
using Aquadata.Application.UseCases.User.Purchase.AddFeedPurchase;
using Aquadata.Application.UseCases.User.Purchase.AddPLPurchase;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/financial")]
[Authorize]
public class FinancialController:ControllerBase
{
  private readonly IMediator _mediator;

  public FinancialController(IMediator mediator)
    => _mediator = mediator;

  [HttpPost("add-feed-purchase")]
  public async Task<IResult> AddFeedPurchase(
    [FromBody] AddFeedPurchaseInput command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(
      new ApiResponse<FeedPurchaseDto>(
        result.Unwrap()
    ));
  } 
  
  [HttpPost("add-probiotic-purchase")]
  public async Task<IResult> AddProbioticPurchase(
    [FromBody] ProbioticPurchaseDto command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  } 

  [HttpPost("add-fertilizer-purchase")]
  public async Task<IResult> AddFertilizerPurchase(
    [FromBody] FertilizerPurchaseDto command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  } 

  [HttpPost("add-post-larvae-purchase")]
  public async Task<IResult> AddPLPurchase(
    [FromBody] AddPLPurchaseInput command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  } 

  [HttpPost("add-generic-purchase")]
  public async Task<IResult> AddGenericPurchase(
    [FromBody] GenericPurchaseDto command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  } 
}
