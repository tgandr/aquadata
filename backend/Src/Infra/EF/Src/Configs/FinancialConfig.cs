using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class FinancialConfig: IEntityTypeConfiguration<FinancialEntity>
{
  public void Configure(EntityTypeBuilder<FinancialEntity> builder)
  {
    builder.ToTable("Financials");
    builder.HasKey(e => e.Id);
    builder.HasMany(e => e.Employees).WithOne()
      .HasForeignKey(e => e.FinancialId).IsRequired();
    builder.HasMany(e => e.Expenses).WithOne()
      .HasForeignKey(e => e.FinancialId).IsRequired();
    builder.HasMany(e => e.Payroll).WithOne()
      .HasForeignKey(e => e.FinancialId).IsRequired();
    builder.HasMany(e => e.PLPurchases).WithOne()
      .HasForeignKey(e => e.FinancialId).IsRequired();
    builder.HasMany(e => e.ProbioticPurchases).WithOne()
      .HasForeignKey(e => e.FinancialId).IsRequired();
    builder.HasMany(e => e.FeedPurchases).WithOne()
      .HasForeignKey(e => e.FinancialId).IsRequired();
    builder.HasMany(e => e.FertilizerPurchases).WithOne()
      .HasForeignKey(e => e.FinancialId).IsRequired();
    builder.HasMany(e => e.GenericPurchases).WithOne()
      .HasForeignKey(e => e.FinancialId).IsRequired();

    builder.Navigation(e => e.Expenses).AutoInclude();
    builder.Navigation(e => e.Employees).AutoInclude();
    builder.Navigation(e => e.Payroll).AutoInclude();
    builder.Navigation(e => e.FeedPurchases).AutoInclude();
    builder.Navigation(e => e.FertilizerPurchases).AutoInclude();
    builder.Navigation(e => e.PLPurchases).AutoInclude();
    builder.Navigation(e => e.ProbioticPurchases).AutoInclude();
    builder.Navigation(e => e.GenericPurchases).AutoInclude();
  }
}
