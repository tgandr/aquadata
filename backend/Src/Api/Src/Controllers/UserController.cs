using Application.UseCases.User.CreateUser;
using Aquadata.Api.Extensions;
using Aquadata.Api.Models;
using Aquadata.Api.Response;
using Aquadata.Application.Dtos;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Application.UseCases.User.DeleteUser;
using Aquadata.Application.UseCases.User.GetUser;
using Aquadata.Application.UseCases.User.Purchase.AddFeedPurchase;
using Aquadata.Application.UseCases.User.Purchase.AddFertilizerPurchase;
using Aquadata.Application.UseCases.User.Purchase.AddProbioticPurchase;
using Aquadata.Application.UseCases.User.UpdateUser;
using Aquadata.Core.Security;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/users")]
public class UserController: ControllerBase
{
  private readonly IMediator _mediator;
  private readonly IAuthenticateService _auth;

  public UserController(IMediator mediator, IAuthenticateService auth)
  {
    _mediator = mediator;
    _auth = auth;
  }
    
  
  [HttpPost("signup")]
  public async Task<IResult> SignUp([FromBody] CreateUserInput command, 
  CancellationToken cancellationToken)
  {    
    var userResult = await _mediator.Send(command, cancellationToken);

    if (userResult.IsFail)
      return Results.Extensions.MapResult(userResult);

    var token = _auth.GenerateToken(
      userResult.Unwrap().Id.ToString(), 
      command.Email
    );

    return Results.Created(
      nameof(SignUp),
      new ApiResponse<ApiCredentials>(new ApiCredentials(
        userResult.Unwrap(),
        token
      ))
    );
  }

  [HttpPost("signin")]
  public async Task<IResult> SignIn([FromBody] LoginModel login)
  {
    var (isAuth, user) = await _auth.Authenticate(login.Email, login.Password);
 
    if (user == null || !isAuth)
      return Results.Unauthorized();
    
    var token = _auth.GenerateToken(user.Id.ToString(), login.Email);

    return Results.Ok(new ApiResponse<ApiCredentials>(
      new ApiCredentials(
      UserOutput.FromEntity(user),
      token)
    ));
  }

  [HttpGet("{id}")]
  [Authorize]
  public async Task<IResult> Get([FromRoute] Guid id, 
  CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new GetUserInput(id), cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(new ApiResponse<UserOutput>(result.Unwrap()));
  }

  [HttpPut]
  [Authorize]
  public async Task<IResult> Update(
    [FromBody] UpdateUserInput command,
    CancellationToken cancellationToken)
  { 
    var result = await _mediator.Send(command,cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(new ApiResponse<UserOutput>(result.Unwrap()));
  }

  [HttpDelete("{id}")]
  [Authorize]
  public async Task<IResult> Delete(
    [FromRoute] Guid id,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new DeleteUserInput(id), cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.NoContent();
  }

  #region Purchases
  [HttpPost("add-feed-purchase")]
  [Authorize]
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
  [Authorize]
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
  [Authorize]
  public async Task<IResult> AddFertilizerPurchase(
    [FromBody] FertilizerPurchaseDto command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  } 
  #endregion
}
