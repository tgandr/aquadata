using Application.UseCases.User.CreateUser;
using Aquadata.Api.Response;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Application.UseCases.User.DeleteUser;
using Aquadata.Application.UseCases.User.GetUser;
using Aquadata.Application.UseCases.User.UpdateUser;
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

  [HttpGet("{id}")]
  public async Task<IActionResult> Get([FromRoute] Guid id, 
  CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new GetUserInput(id), cancellationToken);

    if (result.IsFail)
      return NotFound(result.Error);

    return Ok(new ApiResponse<UserOutput>(result.Unwrap()));
  }

  [HttpPut]
  public async Task<IActionResult> Update(
    [FromBody] UpdateUserInput command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command,cancellationToken);

    if (result.IsFail)
      return BadRequest(result.Error);
    
    return Ok(new ApiResponse<UserOutput>(result.Unwrap()));
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(
    [FromRoute] Guid id,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new DeleteUserInput(id), cancellationToken);

    if (result.IsFail)
      return NotFound(result.Error);

    return NoContent();
  }
}
