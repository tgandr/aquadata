using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.User.GetStocks;

public record GetStocksInput: IUseCaseRequest<ICollection<StockDto>>
{}
