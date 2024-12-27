using Aquadata.Core.Entities.Purchase;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class FeedPurchaseConfig: IEntityTypeConfiguration<FeedPurchaseEntity>
{
  public void Configure(EntityTypeBuilder<FeedPurchaseEntity> builder)
  {
    builder.ToTable("FeedPurchases");
    builder.HasKey(e => e.Id);
  }
}

public class FertilizerPurchaseConfig: IEntityTypeConfiguration<FertilizerPurchaseEntity>
{
  public void Configure(EntityTypeBuilder<FertilizerPurchaseEntity> builder)
  {
    builder.ToTable("FertilizerPurchases");
    builder.HasKey(e => e.Id);
  }
}

public class GenericPurchaseConfig: IEntityTypeConfiguration<GenericPurchaseEntity>
{
  public void Configure(EntityTypeBuilder<GenericPurchaseEntity> builder)
  {
    builder.ToTable("GenericPurchases");
    builder.HasKey(e => e.Id);
  }
}

public class ProbioticsPurchaseConfig: IEntityTypeConfiguration<ProbioticsPurchaseEntity>
{
  public void Configure(EntityTypeBuilder<ProbioticsPurchaseEntity> builder)
  {
    builder.ToTable("ProbioticsPurchases");
    builder.HasKey(e => e.Id);
  }
}