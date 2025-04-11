using Aquadata.Core.Entities.Subscription;
using Aquadata.Core.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class SignatureConfig : IEntityTypeConfiguration<SubscriptionEntity>
{
  public void Configure(EntityTypeBuilder<SubscriptionEntity> builder)
  {
    builder.ToTable("Subscriptions");
    builder.HasKey(e => e.Id);
    builder.Property(e => e.Status)
      .HasConversion<string>()
      .IsRequired();

    builder.HasOne<UserEntity>()
      .WithOne()
      .HasForeignKey<SubscriptionEntity>(e => e.UserId);
  }
}
