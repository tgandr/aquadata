using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Entities.Stock;

namespace Aquadata.Core.Interfaces.Repository;

public interface IFinancialRepository
{
  Task<FinancialEntity?> Get(Guid userId);
  Task<Guid> GetIdByUser(Guid userId);
  Task<bool> EmployeeExists(Guid employeeId, Guid userId);
  Task Add(FeedPurchaseEntity feedPurchase);
  Task Add(ProbioticsPurchaseEntity probioticPurchase);
  Task Add(FertilizerPurchaseEntity fertilizerPurchase);
  Task Add(PostLarvaePurchaseEntity pLPurchase);
  Task Add(GenericPurchaseEntity genericPurchase);
  Task Add(EmployeeEntity employee);
  Task Add(EmployeePaymentEntity employeePayment);
  Task Add(ExpenseEntity expense);
}
