using System.Threading.Tasks;
using Aquadata.Api.Response;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Interfaces.Repository;
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

  public SubscriptionsController(
    ISubscriptionRepository repository,
    IAuthenticatedUserService authenticatedUser)
  {
    _repository = repository;
    _authenticatedUser = authenticatedUser;
  }

  [HttpGet("status")]
  public async Task<IResult> GetStatus()
  {
    var userId = _authenticatedUser.GetUserId();
    var status = await _repository.GetStatus(userId);

    if (status == null)
      return Results.NotFound("Subscription not found");
    
    return Results.Ok(new ApiResponse<object>(new {
      Status = status.ToString()
    }));
  }
}
