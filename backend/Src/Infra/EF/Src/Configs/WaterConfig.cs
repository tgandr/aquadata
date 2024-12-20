using Aquadata.Core.Entities.Water;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class WaterConfig : IEntityTypeConfiguration<WaterEntity>
{
  public void Configure(EntityTypeBuilder<WaterEntity> builder)
  {
    builder.ComplexProperty(e => e.PH);   
  }
}
