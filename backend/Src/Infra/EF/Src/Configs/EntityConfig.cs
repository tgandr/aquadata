using Aquadata.Core.SeedWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aquadata.Infra.EF.Configs;

public class EntityConfig: IEntityTypeConfiguration<Entity>
{
    public void Configure(EntityTypeBuilder<Entity> builder)
    {
        
        builder.Property(e => e.Id)
            .ValueGeneratedOnAdd();
    }
}
