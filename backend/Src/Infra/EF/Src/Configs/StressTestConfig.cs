using Aquadata.Core.Entities.StressTest;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class StressTestConfig : IEntityTypeConfiguration<StressTestEntity>
{
  public void Configure(EntityTypeBuilder<StressTestEntity> builder)
  {
    builder.ToTable("StressTests");
    builder.HasKey(e => e.Id);
  }
}
