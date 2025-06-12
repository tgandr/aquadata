using Application.UseCases.User.CreateUser;
using Aquadata.Api.Extensions;
using Aquadata.Api.Models;
using Aquadata.Api.Response;
using Aquadata.Application.Dtos;
using Aquadata.Application.UseCases.User.Common;
using Aquadata.Application.UseCases.User.DeleteUser;
using Aquadata.Application.UseCases.User.GetInventories;
using Aquadata.Application.UseCases.User.GetStocks;
using Aquadata.Application.UseCases.User.GetUser;
using Aquadata.Application.UseCases.User.UpdateUser;
using Aquadata.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Aquadata.Application.UseCases.User.AddManager;
using System.Text.RegularExpressions;
using Aquadata.Core.Entities.Manager;
using Aquadata.Application.UseCases.Manager.Common;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/users")]
public class UserController : ControllerBase
{
  private readonly IMediator _mediator;
  private readonly IAuthService _auth;

  public UserController(IMediator mediator, IAuthService auth)
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

    return Results.Created(
      nameof(SignUp),
      new ApiResponse<ApiCredentials>(new ApiCredentials(
        userResult.Unwrap(),
        ""
      ))
    );
  }

  [HttpPost("signin")]
  public async Task<IResult> SignIn([FromBody] LoginModel login)
  {
    bool isAuth;
    dynamic? user;
    
    if (isPhone(login.User))
    {
      var result = await _auth.AuthenticateManager(login.User, login.Password);
      isAuth = result.Item1;
      user = result.Item2;
    }
    else
    {
      var result = await _auth.Authenticate(login.User, login.Password);
      isAuth = result.Item1;
      user = result.Item2;
    }

    if (user == null || !isAuth)
      return Results.Unauthorized();

    if (user is ManagerEntity)
      return Results.Ok(new ApiResponse<ManagerCredentials>(
        new ManagerCredentials(
          ManagerOutput.FromEntity(user)
        )
      ));
      
      return Results.Ok(new ApiResponse<ApiCredentials>(
      new ApiCredentials(
      UserOutput.FromEntity(user),
      "")
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
    var result = await _mediator.Send(command, cancellationToken);

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

  [HttpPost("add-manager")]
  [Authorize]
  public async Task<IResult> AddManager(
    [FromBody] AddManagerInput request,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(request, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(result.Unwrap());
  }

  [HttpPost("add-stock")]
  [Authorize]
  public async Task<IResult> AddStock(
    [FromBody] StockDto command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  }

  [HttpPost("add-inventory")]
  [Authorize]
  public async Task<IResult> AddInventory(
    [FromBody] InventoryDto command,
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  }

  [HttpGet("inventories")]
  [Authorize]
  public async Task<IResult> GetInventories(
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new GetInventoriesInput(), cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(
      new ApiResponse<ICollection<InventoryDto>>(result.Unwrap())
    );
  }

  [HttpGet("stocks")]
  [Authorize]
  public async Task<IResult> GetStocks(
    CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new GetStocksInput(), cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(
      new ApiResponse<ICollection<StockDto>>(result.Unwrap())
    );
  }

  private bool isPhone(string phone)
  {
    string pattern = @"^[1-9]{2}9\d{8}$";
    return Regex.IsMatch(phone, pattern);
  }
}
