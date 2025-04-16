using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.Payment.Create;

public class CreatePaymentInput: IUseCaseRequest<PaymentOutput>
{
  public string? Id {get;set;}
  public string? Type {get;set;}
  public string Token { get; set; }
  public PayerInfo Payer { get; set; }

  public class PayerInfo
  {
    public string Email { get; set; }
    public IdentificationInfo Identification { get; set; }
  }

  public class IdentificationInfo
  {
    public string Type { get; set; }
    public string Number { get; set; }
  }
}
