using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.Interfaces;

public interface IUseCaseHandler<TRequest, TResponse>
:IRequestHandler<TRequest, Result<TResponse>> 
where TRequest: IUseCaseRequest<TResponse>
{}
