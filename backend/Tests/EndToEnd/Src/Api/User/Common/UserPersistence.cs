using Aquadata.Core.Entities.User;
using Aquadata.EndToEndTests.Api.Base;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.EndToEndTests.Api.User.Common;

public class UserPersistence: BasePersistence
{
  public UserPersistence(ApplicationDbContext context)
  :base(context){}

  public async Task<UserEntity?> GetById(Guid id)
    => await _context.Users
      .AsNoTracking()
      .Include(u => u.FeedPurchases)
      .Include(u => u.ProbioticPurchases)
      .Include(u => u.FertilizerPurchases)
      .FirstOrDefaultAsync(e => e.Id == id);
}
