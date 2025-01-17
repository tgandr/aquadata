using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Entities.StressTest;
using Aquadata.Core.Entities.Water;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class CultivationConfig : IEntityTypeConfiguration<CultivationEntity>
{
  public void Configure(EntityTypeBuilder<CultivationEntity> builder)
  {
    builder.ToTable("Cultivations");
    builder.HasKey(e => e.Id);
    builder.HasOne(e => e.Water).WithOne()
      .HasForeignKey<WaterEntity>(e => e.CultivationId);
    builder.HasOne(e => e.Objective).WithOne()
      .HasForeignKey<ObjectiveEntity>(e => e.CultivationId);
    builder.HasOne(e => e.StressTest).WithOne()
      .HasForeignKey<StressTestEntity>(e => e.CultivationId);
    builder.HasMany(e => e.Biometrics).WithOne()
      .HasForeignKey(e => e.CultivationId);
    builder.HasMany(e => e.Harvests).WithOne()
      .HasForeignKey(e => e.CultivationId);
    builder.HasMany(e => e.WaterParams).WithOne()
      .HasForeignKey(e => e.CultivationId);
    builder.HasMany(e => e.Feed).WithOne()
      .HasForeignKey(e => e.CultivationId);
    builder.HasMany(e => e.Fertilizers).WithOne()
      .HasForeignKey(e => e.CultivationId);
    builder.HasMany(e => e.WaterAndAcclimation).WithOne()
      .HasForeignKey(e => e.CultivationId);
  }
}
