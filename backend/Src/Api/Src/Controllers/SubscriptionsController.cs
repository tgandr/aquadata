using Aquadata.Api.Extensions;
using Aquadata.Api.Response;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.PaymentGateway.CancelSubscription;
using Aquadata.Core.Enums;
using Aquadata.Core.Interfaces.Repository;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("subscriptions")]
[Authorize]
public class SubscriptionsController: ControllerBase
{
  private readonly ISubscriptionRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUser;
  private readonly IMediator _mediator;

  public SubscriptionsController(
    ISubscriptionRepository repository,
    IMediator mediator,
    IAuthenticatedUserService authenticatedUser)
  {
    _repository = repository;
    _mediator = mediator;
    _authenticatedUser = authenticatedUser;
  }

  [HttpGet]
  public async Task<IResult> GetSubscription()
  {
    var userId = _authenticatedUser.GetUserId();
    var entity = await _repository.GetByUserId(userId);

    if (entity == null)
      return Results.NotFound("Subscription not found");
    
    return Results.Ok(new ApiResponse<object>(new
    {
      isActive = entity.Status == SubscriptionStatus.Active,
      entity.ExpiresAt,
    }));
  }

  [HttpDelete("cancel")]
  public async Task<IResult> CancelSubscription()
  {
    var result = await _mediator.Send(new CancelSubscriptionInput());

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(new {});
  }
}
