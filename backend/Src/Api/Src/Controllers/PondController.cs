using Aquadata.Api.Response;
using Aquadata.Application.UseCases.Pond.Common;
using Aquadata.Application.UseCases.Pond.CreatePond;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/ponds")]
public class PondController: ControllerBase
{
  private readonly IMediator _mediator;

  public PondController(IMediator mediator)
    => _mediator = mediator;

  [HttpPost]
  public async Task<IActionResult> Create([FromBody] CreatePondInput command)
  {
    var result = await _mediator.Send(command);

    if (result.IsFail)
      return BadRequest(result.Error);

    return CreatedAtAction(
      nameof(Create),
      new { id = result.Unwrap().Id },
      new ApiResponse<PondOutput>(result.Unwrap())
    );
  }

}
