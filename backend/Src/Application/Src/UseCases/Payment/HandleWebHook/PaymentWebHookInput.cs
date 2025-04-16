using Aquadata.Application.Interfaces;
using MediatR;

namespace Aquadata.Application.UseCases.Payment.HandleWebHook;

public class PaymentWebHookInput: IUseCaseRequest<Unit>
{
  public string PaymentId {get;}
  public string Type {get;}
  
  public PaymentWebHookInput(string paymentId, string type)
  {
    PaymentId = paymentId;
    Type = type;
  }
  
}