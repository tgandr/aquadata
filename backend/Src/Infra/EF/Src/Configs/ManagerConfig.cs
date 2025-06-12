using Aquadata.Core.Entities.Manager;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class ManagerConfig : IEntityTypeConfiguration<ManagerEntity>
{
  public void Configure(EntityTypeBuilder<ManagerEntity> builder)
  {
    builder.ToTable("Managers");
    builder.HasKey(e => e.Id);
    builder.HasIndex(e => e.Phone).IsUnique();

    builder.HasOne(e => e.Producer)
      .WithOne()
      .HasForeignKey<ManagerEntity>(e => e.ProducerId)
      .IsRequired();

    builder.Navigation(e => e.Producer).AutoInclude();
  }
}
