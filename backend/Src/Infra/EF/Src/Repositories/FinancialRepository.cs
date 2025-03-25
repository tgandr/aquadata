using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class FinancialRepository: IFinancialRepository
{
  private readonly ApplicationDbContext _dbContext;

  public FinancialRepository(ApplicationDbContext dbContext)
    => _dbContext = dbContext;

  public Task<FinancialEntity?> Get(Guid userId)
    => _dbContext.Financials.FirstOrDefaultAsync(f => f.UserId == userId);

  public async Task Add(FeedPurchaseEntity feedPurchase)
    => await _dbContext.FeedPurchases.AddAsync(feedPurchase);

  public async Task Add(ProbioticsPurchaseEntity probioticPurchase)
    => await _dbContext.ProbioticPurchases.AddAsync(probioticPurchase);

  public async Task Add(FertilizerPurchaseEntity fertilizerPurchase)
    => await _dbContext.FertilizerPurchases.AddAsync(fertilizerPurchase);

  public async Task Add(PostLarvaePurchaseEntity pLPurchase)
    => await _dbContext.PLPurchases.AddAsync(pLPurchase);

  public async Task Add(GenericPurchaseEntity genericPurchase)
    => await _dbContext.GenericPurchases.AddAsync(genericPurchase);
    
  public async Task Add(EmployeeEntity employee)
    => await _dbContext.Employees.AddAsync(employee);

  public async Task Add(EmployeePaymentEntity employeePayment)
    => await _dbContext.Payroll.AddAsync(employeePayment);
    
  public async Task<bool> EmployeeExists(Guid employeeId, Guid userId)
    => await _dbContext.Employees.Join(_dbContext.Financials,
      e => e.FinancialId,
      f => f.Id,
      (e, f) => new {e.Id, f.UserId}
      ).AnyAsync(x => x.Id == employeeId && x.UserId == userId
    );

  public async Task Add(ExpenseEntity expense)
    => await _dbContext.Expenses.AddAsync(expense);

  public async Task<Guid> GetIdByUser(Guid userId)
    => await _dbContext.Financials
      .Where(f => f.UserId == userId)
      .Select(f => f.Id)
      .FirstOrDefaultAsync();

}
