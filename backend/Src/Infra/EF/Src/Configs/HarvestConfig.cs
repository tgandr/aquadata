using Aquadata.Core.Entities.Harvest;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class HarvestConfig : IEntityTypeConfiguration<HarvestEntity>
{
  public void Configure(EntityTypeBuilder<HarvestEntity> builder)
  {
    builder.ToTable("Harvests");
    builder.HasKey(e => e.Id);
    builder.HasMany(e => e.Biometrics).WithOne()
      .HasForeignKey(e => e.HarverstId);
  }
}
