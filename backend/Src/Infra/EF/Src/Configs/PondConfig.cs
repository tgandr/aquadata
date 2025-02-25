using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Entities.Pond;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class PondConfig : IEntityTypeConfiguration<PondEntity>
{
  public void Configure(EntityTypeBuilder<PondEntity> builder)
  {
    builder.ToTable("Ponds");
    builder.HasKey(e => e.Id);
    builder.HasMany(e => e.Cultivations)
    .WithOne().HasForeignKey(e => e.PondId);

    builder.HasMany<CostPerPondEntity>()
      .WithOne().HasForeignKey(e => e.PondId);

    builder.Navigation(p => p.Cultivations).AutoInclude();
  }
}
