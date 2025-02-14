namespace Aquadata.Application.Common;

public abstract class PurchaseDtoBase
{
  public string Date {get;}
  public string Label {get;}
  public int Quantity {get;}
  public decimal Value {get;}

  protected PurchaseDtoBase(string date, string label, int quantity, 
  decimal value)
  {
    Date = date;
    Label = label;
    Quantity = quantity;
    Value = value;
  }
}
