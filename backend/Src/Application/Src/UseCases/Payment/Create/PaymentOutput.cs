namespace Aquadata.Application.UseCases.Payment.Create;

public class PaymentOutput
{
  public string Id {get;}
  public string Status {get;}
  public PaymentOutput(string id, string status = "")
  {
    Id = id;
    Status = status;
  }

  public static PaymentOutput Empty() 
    => new("");
}
