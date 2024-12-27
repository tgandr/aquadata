using Application.UseCases.User.CreateUser;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/users")]
public class UserController: ControllerBase
{
  private readonly IMediator _mediator;

  public UserController(IMediator mediator)
    => _mediator = mediator;
  
  [HttpPost]
  public async Task<IActionResult> Create([FromBody] CreateUserInput command, 
  CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return BadRequest(result.Error);

    return CreatedAtAction(
      nameof(Create),
      new { id = result.Unwrap().Id },
      new ApiResponse<UserOutput>(result.Unwrap())
    );
  }
}
