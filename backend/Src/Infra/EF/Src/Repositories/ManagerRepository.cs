using Aquadata.Core.Entities.Manager;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class ManagerRepository : IManagerRepository
{
  private readonly ApplicationDbContext _context;

  public ManagerRepository(ApplicationDbContext context)
    => _context = context;

  public async Task Create(ManagerEntity manager)
    => await _context.Managers.AddAsync(manager);

  public Task Delete(ManagerEntity manager)
    => Task.FromResult(_context.Managers.Remove(manager));

  public async Task<ManagerEntity?> GetByPhone(string phone)
   => await _context.Managers.FirstOrDefaultAsync(
    e => e.Phone == phone
   );
}
