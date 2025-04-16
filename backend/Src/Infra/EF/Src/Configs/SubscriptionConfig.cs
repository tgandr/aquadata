using Aquadata.Core.Entities.Subscription;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class SubscriptionConfig : IEntityTypeConfiguration<SubscriptionEntity>
{
  public void Configure(EntityTypeBuilder<SubscriptionEntity> builder)
  {
    builder.ToTable("Subscriptions");
    builder.HasKey(e => e.Id);
    builder.Property(e => e.Status)
      .HasConversion<string>()
      .IsRequired();

    builder.HasOne(e => e.User)
      .WithOne()
      .HasForeignKey<SubscriptionEntity>(e => e.UserId);
  }
}
