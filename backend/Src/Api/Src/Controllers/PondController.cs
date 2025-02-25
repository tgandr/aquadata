using Aquadata.Api.Extensions;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Application.UseCases.Pond.CreatePond;
using Aquadata.Application.UseCases.Pond.DeactivatePond;
using Aquadata.Application.UseCases.Pond.GetPond;
using Aquadata.Application.UseCases.Pond.GetPondsByUser;
using Aquadata.Application.UseCases.Pond.UpdatePond;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/ponds")]
[Authorize]
public class PondController: ControllerBase
{
  private readonly IMediator _mediator;

  public PondController(IMediator mediator)
    => _mediator = mediator;

  [HttpPost]
  public async Task<IResult> Create([FromBody] CreatePondInput command, 
  CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created(
      nameof(Create),
      new ApiResponse<PondOutput>(result.Unwrap())
    );
  }

  [HttpGet("{id}")]
  public async Task<IResult> GetById(
    [FromRoute] Guid id,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new GetPondInput(id), cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);
    
    return Results.Ok(new ApiResponse<PondOutput>(
      result.Unwrap()
    ));
  }

  [HttpGet]
  public async Task<IResult> GetPondList(CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new GetPondsByUserInput(), cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(new ApiResponse<ICollection<PondOutput>>(
      result.Unwrap()
    ));
  }

  [HttpPut]
  public async Task<IResult> Update([FromBody] UpdatePondInput command,
  CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(new ApiResponse<PondOutput>(
      result.Unwrap()
    ));
  }

  [HttpDelete("deactivate/{id}")]
  public async Task<IResult> Deactivate([FromRoute] Guid id,
  CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new DeactivatePondInput(id), 
    cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(new ApiResponse<PondOutput>(
      result.Unwrap()
    ));
  }
}
