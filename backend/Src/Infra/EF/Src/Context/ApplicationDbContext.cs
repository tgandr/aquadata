using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Fertilizer;
using Aquadata.Core.Entities.Harvest;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Entities.User;
using Aquadata.Core.Entities.Water;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Context;

public class ApplicationDbContext: DbContext
{
  public DbSet<UserEntity> Users {get;set;}
  public DbSet<PondEntity> Ponds {get;set;}
  public DbSet<CultivationEntity> Cultivations {get;set;}
  public DbSet<ObjectiveEntity> Objectives {get;set;}
  public DbSet<BiometricEntity> Biometrics {get;set;}
  public DbSet<WaterEntity> Waters {get;set;}
  public DbSet<FertilizerEntity> Fertilizers {get;set;}
  public DbSet<HarvestEntity> Harvests {get;set;}

  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    :base(options){}
  
  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
    builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
  }
}
