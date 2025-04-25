namespace Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;

public class SubscriptionOutput
{
  public string Id {get;set;}
  public string Status {get;set;}
  public string InitPoint {get;set;}
  
  public SubscriptionOutput(string id, string initPoint, string status = "")
  {
    Id = id;
    Status = status;
    InitPoint = initPoint;
  }
}
