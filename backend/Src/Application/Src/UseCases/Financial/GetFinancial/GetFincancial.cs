using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Financial.Common;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Application.UseCases.Financial.GetFinancial;

public class GetFincancial : IUseCaseHandler<GetFinancialInput, FinancialOutput>
{
  private readonly IFinancialRepository _financialRepository;
  private readonly IAuthenticatedUserService _authenticatedUserService;

  public GetFincancial(
      IFinancialRepository financialRepository,
      IAuthenticatedUserService authenticatedUserService)
  {
      _financialRepository = financialRepository;
      _authenticatedUserService = authenticatedUserService;
  }

  public async Task<Result<FinancialOutput>> Handle(GetFinancialInput _, CancellationToken cancellationToken)
  {
    var userId = _authenticatedUserService.GetUserId();
    var result = await _financialRepository.Get(userId);

    if (result == null)
    {
      return Result<FinancialOutput>.Fail(
        Error.NotFound(
          "UseCases.Financial.GetFinancial",
          "Financial not found"
        )
      );
    }

    return Result<FinancialOutput>.Ok(
      FinancialOutput.FromEntity(result)
    );
  }
}
