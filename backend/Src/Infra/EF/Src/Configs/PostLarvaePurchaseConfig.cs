using Aquadata.Core.Entities.Purchase;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class PostLarvaePurchaseConfig : IEntityTypeConfiguration<PostLarvaePurchaseEntity>
{
  public void Configure(EntityTypeBuilder<PostLarvaePurchaseEntity> builder)
  {
    
    builder.HasOne(e => e.Cultivation)
      .WithOne()
      .HasForeignKey<PostLarvaePurchaseEntity>(e => e.CultivationId)
      .IsRequired();
  }
}
