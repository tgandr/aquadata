using Aquadata.Core.Entities.Stock;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class StockConfig: IEntityTypeConfiguration<StockEntity>
{
  public void Configure(EntityTypeBuilder<StockEntity> builder)
  {
    builder.ToTable("Stocks");
    builder.HasKey(e => e.Id);
  }
}

