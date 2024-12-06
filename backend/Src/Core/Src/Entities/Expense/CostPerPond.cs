namespace Aquadata.Core.Entities.Expense;

public class CostPerPond
{
  public Guid PondId {get;}
  public decimal Value {get;}

  public CostPerPond(Guid pondId, decimal value)
  {
    PondId = pondId;
    Value = value;
  }

}
