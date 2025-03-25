using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Financial.Common;

namespace Aquadata.Application.UseCases.Financial.GetFinancial;

public record GetFinancialInput()
: IUseCaseRequest<FinancialOutput>;

