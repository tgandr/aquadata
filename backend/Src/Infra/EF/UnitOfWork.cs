using Aquadata.Application.Interfaces;
using Aquadata.Infra.EF.Context;

namespace Aquadata.Infra.EF;

public class UnitOfWork : IUnitOfWork
{
  private readonly ApplicationDbContext _context;

  public UnitOfWork(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task Commit(CancellationToken cancellationToken)
  {
    await _context.SaveChangesAsync(cancellationToken);
  }

  public Task RollBack(CancellationToken cancellationToken)
  {
    return Task.CompletedTask;
  }
}
