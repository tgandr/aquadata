using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Purchase;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class PostLarvaePurchaseConfig : IEntityTypeConfiguration<PostLarvaePurchaseEntity>
{
  public void Configure(EntityTypeBuilder<PostLarvaePurchaseEntity> builder)
  {
    builder.ToTable("PostLarvaePurchases");
    builder.HasKey(e => e.Id);
    builder.HasOne<CultivationEntity>()
      .WithOne()
      .HasForeignKey<PostLarvaePurchaseEntity>(e => e.CultivationId)
      .IsRequired();
  }
}
