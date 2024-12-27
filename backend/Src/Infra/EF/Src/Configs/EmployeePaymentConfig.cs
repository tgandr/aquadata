using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.EmployeePayment;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class EmployeePaymentConfig : IEntityTypeConfiguration<EmployeePaymentEntity>
{
  public void Configure(EntityTypeBuilder<EmployeePaymentEntity> builder)
  {
    builder.ToTable("EmployeePayments");
    builder.HasKey(e => e.Id);
    builder.HasOne<EmployeeEntity>()
      .WithOne()
      .HasForeignKey<EmployeePaymentEntity>(e => e.EmployeeId)
      .IsRequired();
  }
}
