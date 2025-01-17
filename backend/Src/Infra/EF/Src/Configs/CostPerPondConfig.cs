using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Entities.Pond;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class CostPerPondConfig : IEntityTypeConfiguration<CostPerPondEntity>
{
  public void Configure(EntityTypeBuilder<CostPerPondEntity> builder)
  {
    builder.ToTable("CostPerPond");
    builder.HasKey(e => e.Id);
    builder.HasOne<PondEntity>()
    .WithOne()
    .HasForeignKey<CostPerPondEntity>(e => e.PondId)
    .IsRequired();
  }
}
