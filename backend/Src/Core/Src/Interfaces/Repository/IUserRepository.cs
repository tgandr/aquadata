using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Entities.Stock;
using Aquadata.Core.Entities.User;
using Aquadata.Core.SeedWork;

namespace Aquadata.Core.Interfaces.Repository;

public interface IUserRepository: IGenericRepository<UserEntity>
,IDeletableRepository<UserEntity>
{
  Task<UserEntity?> GetByEmail(string email);
  Task<bool> IsEmailRegistered(string email);
  Task<bool> EmployeeExists(Guid employeeId, Guid userId);
  Task AddFeedPurchase(FeedPurchaseEntity feedPurchase);
  Task AddProbioticPurchase(ProbioticsPurchaseEntity probioticPurchase);
  Task AddFertilizerPurchase(FertilizerPurchaseEntity fertilizerPurchase);
  Task AddPLPurchase(PostLarvaePurchaseEntity pLPurchase);
  Task AddGenericPurchase(GenericPurchaseEntity genericPurchase);
  Task AddEmployee(EmployeeEntity employee);
  Task AddEmployeePayment(EmployeePaymentEntity employeePayment);
  Task AddExpense(ExpenseEntity expense);
  Task AddStock(StockEntity stock);
  Task AddInventory(InventoryEntity inventory);
}