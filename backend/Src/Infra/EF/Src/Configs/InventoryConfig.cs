using Aquadata.Core.Entities.Inventory;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class InventoryConfig : IEntityTypeConfiguration<InventoryEntity>
{
  public void Configure(EntityTypeBuilder<InventoryEntity> builder)
  {
    builder.ToTable("Inventories");
    builder.HasKey(e => e.Id);
    builder.Property(e => e.Status)
      .HasConversion<string>();
  }
}
