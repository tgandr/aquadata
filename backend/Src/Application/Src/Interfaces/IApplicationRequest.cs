using Aquadata.Core.Util;
using MediatR;

namespace Aquadata.Application.Interfaces;

public interface IApplicationRequest<TOutput>: IRequest<Result<TOutput>>
{}
