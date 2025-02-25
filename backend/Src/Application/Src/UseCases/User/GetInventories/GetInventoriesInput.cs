using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.User.GetInventories;

public record GetInventoriesInput: IUseCaseRequest<ICollection<InventoryDto>>
{}
