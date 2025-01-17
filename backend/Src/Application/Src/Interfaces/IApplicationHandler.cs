using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.Interfaces;

public interface IApplicationHandler<TRequest, TResponse>
:IRequestHandler<TRequest, Result<TResponse>> 
where TRequest: IApplicationRequest<TResponse>
{}
