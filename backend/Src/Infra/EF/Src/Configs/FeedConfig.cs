
using Aquadata.Core.Entities.Feed;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class FeedConfig : IEntityTypeConfiguration<FeedEntity>
{
  public void Configure(EntityTypeBuilder<FeedEntity> builder)
  {
    builder.ToTable("Feeds");
    builder.HasKey(e => e.Id);
  }
}
