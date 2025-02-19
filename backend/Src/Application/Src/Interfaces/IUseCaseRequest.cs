using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.Interfaces;

public interface IUseCaseRequest<TOutput>: IRequest<Result<TOutput>>
{}
