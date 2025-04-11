using Aquadata.Core.Entities.Payment;
using Aquadata.Core.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class PaymentConfig: IEntityTypeConfiguration<PaymentEntity>
{
  public void Configure(EntityTypeBuilder<PaymentEntity> builder)
  {
    builder.ToTable("Payments");
    builder.HasKey(e => e.Id);
    builder.Property(e => e.Status)
      .HasConversion<string>()
      .IsRequired();

    builder.HasOne<UserEntity>()
    .WithMany()
    .HasForeignKey(e => e.UserId);
  }
}
