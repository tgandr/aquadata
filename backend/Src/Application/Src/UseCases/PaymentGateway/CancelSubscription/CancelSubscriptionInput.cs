using Aquadata.Application.Interfaces;
using MediatR;

namespace Aquadata.Application.UseCases.PaymentGateway.CancelSubscription;

public class CancelSubscriptionInput : IUseCaseRequest<Unit>
{
}
