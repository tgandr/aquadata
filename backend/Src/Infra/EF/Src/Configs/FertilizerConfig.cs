using Aquadata.Core.Entities.Fertilizer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class FertilizerConfig : IEntityTypeConfiguration<FertilizerEntity>
{
  public void Configure(EntityTypeBuilder<FertilizerEntity> builder)
  {
    builder.ToTable("Fertilizers");
    builder.HasKey(e => e.Id);
    builder.Property(e => e.Type)
      .HasConversion<string>();
    builder.Property(e => e.MeasureUnit)
      .HasConversion<string>();
    
  }
}
