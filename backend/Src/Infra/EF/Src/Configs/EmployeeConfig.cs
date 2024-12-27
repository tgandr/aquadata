using Aquadata.Core.Entities.Employee;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class EmployeeConfig : IEntityTypeConfiguration<EmployeeEntity>
{
  public void Configure(EntityTypeBuilder<EmployeeEntity> builder)
  {
    builder.ToTable("Employees");
    builder.HasKey(e => e.Id);
  }
}
