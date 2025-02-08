using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Context;

public class ApplicationDbContext: DbContext
{
  public DbSet<UserEntity> Users {get;set;}
  public DbSet<PondEntity> Ponds {get;set;}
  public DbSet<CultivationEntity> Cultivations {get;set;}
  public DbSet<ObjectiveEntity> Objectives {get;set;}

  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    :base(options){}
  
  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
    builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
  }
}
