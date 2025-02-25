using System.Collections.ObjectModel;
using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.Financial;

public class FinancialEntity: Entity, IAggregateRoot
{
  public virtual Guid UserId {get;set;}
  public virtual ICollection<FeedPurchaseEntity> FeedPurchases {get;set;} 
    = new Collection<FeedPurchaseEntity>();
  public virtual ICollection<FertilizerPurchaseEntity> FertilizerPurchases {get;set;} 
    = new Collection<FertilizerPurchaseEntity>();
  public virtual ICollection<PostLarvaePurchaseEntity> PLPurchases {get;set;} 
    = new Collection<PostLarvaePurchaseEntity>();
  public virtual ICollection<ProbioticsPurchaseEntity> ProbioticPurchases {get;set;} 
    = new Collection<ProbioticsPurchaseEntity>();
  public virtual ICollection<GenericPurchaseEntity> GenericPurchases {get;set;} 
    = new Collection<GenericPurchaseEntity>();
  public virtual ICollection<ExpenseEntity> Expenses {get;set;} 
    = new Collection<ExpenseEntity>();
  public virtual ICollection<EmployeeEntity> Employees {get;set;} 
    = new Collection<EmployeeEntity>();
  public virtual ICollection<EmployeePaymentEntity> Payroll {get;set;} 
    = new Collection<EmployeePaymentEntity>();
  
  public static FinancialEntity Of(Guid userId)
    => Create(new FinancialEntity {UserId = userId}).Unwrap();
  
  protected override Result<Entity> Validate()
  {
    return Result<Entity>.Ok(this);
  }
}
