namespace Aquadata.Application.UseCases.User.Purchase;

public abstract class AddPurchaseBase
{
  public string Date {get;}
  public string Label {get;}
  public int Quantity {get;}
  public decimal Value {get;}

  protected AddPurchaseBase(string date, string label, int quantity, decimal value)
  {
    Date = date;
    Label = label;
    Quantity = quantity;
    Value = value;
  }
}
