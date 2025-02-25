using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Pond.Common;

namespace Aquadata.Application.UseCases.Pond.GetPondsByUser;

public record GetPondsByUserInput: IUseCaseRequest<ICollection<PondOutput>>
{}
