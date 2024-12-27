using Aquadata.Core.Entities.Biometric;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class BiometricConfig : IEntityTypeConfiguration<BiometricEntity>
{
  public void Configure(EntityTypeBuilder<BiometricEntity> builder)
  {
    builder.ToTable("Biometrics");
    builder.HasKey(e => e.Id);
  }
}
