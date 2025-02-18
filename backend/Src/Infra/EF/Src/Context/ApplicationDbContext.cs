using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Entities.Feed;
using Aquadata.Core.Entities.Fertilizer;
using Aquadata.Core.Entities.Harvest;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Entities.Purchase;
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
  public DbSet<FeedEntity> Feed {get;set;}
  public DbSet<FeedPurchaseEntity> FeedPurchases {get;set;}
  public DbSet<ProbioticsPurchaseEntity> ProbioticPurchases {get;set;}
  public DbSet<FertilizerPurchaseEntity> FertilizerPurchases {get;set;}
  public DbSet<PostLarvaePurchaseEntity> PLPurchases {get;set;}
  public DbSet<GenericPurchaseEntity> GenericPurchases {get;set;}
  public DbSet<EmployeeEntity> Employees {get;set;}
  public DbSet<EmployeePaymentEntity> Payroll {get;set;}

  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    :base(options){}
  
  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
    builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
  }
}
