using Aquadata.Core.Entities.Expense;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class ExpenseConfig : IEntityTypeConfiguration<ExpenseEntity>
{
  public void Configure(EntityTypeBuilder<ExpenseEntity> builder)
  {
    builder.ToTable("Expenses");
    builder.HasKey(e => e.Id);
    builder.HasMany(e => e.CostsPerPond)
      .WithOne()
      .HasForeignKey(e => e.ExpenseId)
      .IsRequired();

    builder.Navigation(e => e.CostsPerPond).AutoInclude();
  }
}