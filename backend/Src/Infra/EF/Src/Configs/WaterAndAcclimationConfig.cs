using Aquadata.Core.Entities.WaterAndAcclimation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class WaterAndAcclimationConfig : IEntityTypeConfiguration<WaterAndAcclimationEntity>
{
  public void Configure(EntityTypeBuilder<WaterAndAcclimationEntity> builder)
  {
    builder.ToTable("WaterAndAcclimations");
    builder.HasKey(e => e.Id);
    builder.ComplexProperty(e => e.PH);
    builder.Property(e => e.Origin)
      .HasConversion<string>();
  }
}
