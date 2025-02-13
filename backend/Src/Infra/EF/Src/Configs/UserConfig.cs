using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Entities.Stock;
using Aquadata.Core.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class UserConfig : IEntityTypeConfiguration<UserEntity>
{
  public void Configure(EntityTypeBuilder<UserEntity> builder)
  {
    builder.ToTable("Users");
    builder.HasKey(e => e.Id);
    builder.HasOne(e => e.Stock).WithOne()
      .HasForeignKey<StockEntity>(e => e.UserId).IsRequired();
    builder.HasOne(e => e.Inventory).WithOne()
      .HasForeignKey<InventoryEntity>(e => e.UserId).IsRequired();
    builder.HasMany(e => e.Employees).WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany(e => e.Expenses).WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany(e => e.Payroll).WithOne();
    builder.HasMany(e => e.Ponds).WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany(e => e.PLPurchases).WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany(e => e.ProbioticPurchases).WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany(e => e.FeedPurchases).WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany(e => e.FertilizerPurchases).WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany(e => e.GenericPurchases).WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();

    builder.Navigation(e => e.Stock).AutoInclude();
    builder.Navigation(e => e.Inventory).AutoInclude();
    builder.Navigation(e => e.Ponds).AutoInclude();
    builder.Navigation(e => e.Expenses).AutoInclude();
    builder.Navigation(e => e.Employees).AutoInclude();
    builder.Navigation(e => e.Payroll).AutoInclude();
    builder.Navigation(e => e.FeedPurchases).AutoInclude();
    builder.Navigation(e => e.FertilizerPurchases).AutoInclude();
    builder.Navigation(e => e.PLPurchases).AutoInclude();
    builder.Navigation(e => e.ProbioticPurchases).AutoInclude();
    builder.Navigation(e => e.GenericPurchases).AutoInclude();
  }
}
