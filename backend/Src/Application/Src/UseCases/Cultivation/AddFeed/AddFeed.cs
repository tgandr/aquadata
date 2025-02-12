using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Feed;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.Cultivation.AddFeed;

public class AddFeed: IUseCaseHandler<AddFeedInput, FeedDto>
{
  private readonly IUnitOfWork _unitOfWork;
  private readonly ICultivationRepository _repository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public AddFeed(IUnitOfWork unitOfWork, 
  ICultivationRepository cultivationRepository,
  IAuthenticatedUserService authenticatedUserService)
  {
      _unitOfWork = unitOfWork;
      _repository = cultivationRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<FeedDto>> Handle(AddFeedInput request, CancellationToken cancellationToken)
  {
    var feedResult = FeedEntity.Of(
      request.Date,
      request.Frequency,
      request.TotalOfDay,
      request.RationName,
      request.HadLeftovers,
      request.ReducedOrSuspended
    );

    if (feedResult.IsFail)
      return Result<FeedDto>.Fail(feedResult.Error);

    var userId = _authenticatedUserService.GetUserId() ?? "";
    var cultivationExists = await _repository.Exists(userId, 
    request.CultivationId.ToString());

    if (!cultivationExists)
     return Result<FeedDto>.Fail(
        Error.NotFound(
          "UseCases.Cultivations.AddFeed",
          "Cultivation not found"
        )
    );

    var feed = feedResult.Unwrap();
    feed.CultivationId = request.CultivationId;

    await _repository.AddFeed(feed);
    await _unitOfWork.Commit(cancellationToken);

    return Result<FeedDto>.Ok(
      FeedDto.FromEntity(feed)
    );
  }
}
