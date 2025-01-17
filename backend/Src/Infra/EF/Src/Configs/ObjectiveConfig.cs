using Aquadata.Core.Entities.Objective;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class ObjectiveConfig: IEntityTypeConfiguration<ObjectiveEntity>
{
  public void Configure(EntityTypeBuilder<ObjectiveEntity> builder)
  {
    builder.ToTable("Objectives");
    builder.HasKey(e => e.Id);
  }
}
