using Aquadata.Core.Entities.Expense;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class ExpenseConfig : IEntityTypeConfiguration<ExpenseEntity>
{
  public void Configure(EntityTypeBuilder<ExpenseEntity> builder)
  {
    builder.HasKey(e => e.Id);
    builder.HasMany(e => e.CostsPerPond)
      .WithOne()
      .HasForeignKey(e => e.ExpenseId)
      .IsRequired();
  }
}
