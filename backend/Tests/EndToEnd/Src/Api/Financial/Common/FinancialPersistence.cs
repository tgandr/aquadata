using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Entities.Pond;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.EndToEndTests.Api.Financial.Common;

public class FinancialPersistence
{
  private readonly ApplicationDbContext _context;
  public FinancialPersistence(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<FinancialEntity?> Get(Guid id)
    => await _context.Financials.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
  
  public async Task Insert(EmployeeEntity employee)
  {
    await _context.Employees.AddAsync(employee);
    await _context.SaveChangesAsync();
  }
  
  public async Task Insert(PondEntity pond)
  {
    await _context.Ponds.AddAsync(pond);
    await _context.SaveChangesAsync();
  }

  public async Task Insert(CultivationEntity pond)
  {
    await _context.Cultivations.AddAsync(pond);
    await _context.SaveChangesAsync();
  } 

  public async Task<Guid> GetFinancialId(Guid userId)
    => await _context.Financials
      .Where(f => f.UserId == userId)
      .Select(f => f.Id)
      .FirstOrDefaultAsync();
}
