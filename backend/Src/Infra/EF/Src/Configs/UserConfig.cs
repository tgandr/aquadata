using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Entities.Pond;
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
    builder.HasOne<FinancialEntity>().WithOne()
      .HasForeignKey<FinancialEntity>(e => e.UserId).IsRequired();
    builder.HasMany<StockEntity>().WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany<InventoryEntity>().WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
    builder.HasMany<PondEntity>().WithOne()
      .HasForeignKey(e => e.UserId).IsRequired();
  }
}
