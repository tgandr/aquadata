using Aquadata.Application.Dtos;
using Aquadata.Application.UseCases.Cultivation.Common;
using Aquadata.Core.Entities.Pond;

namespace Aquadata.Application.UseCases.Pond.Common;

public class PondOutput
{
  public Guid Id {get;}
  public string Name {get;}
  public float Area {get;}
  public bool IsActive {get;}
  public DateTime CreatedAt {get;}
  public DateTime UpdatedAt {get;}
  public Guid UserId {get;}

  public ICollection<CultivationOutput>? Cultivations {get;set;}
  
  public PondOutput(Guid id, string name, float area, 
  bool isActive,DateTime createdAt, DateTime updatedAt, Guid userId)
  {
    Id = id;
    Name = name;
    Area = area;
    IsActive = isActive;
    CreatedAt = createdAt;
    UpdatedAt = updatedAt;
    UserId = userId;
  }

  public static PondOutput FromEntity(PondEntity pond)
  {
    var output = new PondOutput(pond.Id, pond.Name, pond.Area, pond.IsActive, 
    pond.CreatedAt, pond.UpdatedAt, pond.UserId);

    if (pond.Cultivations != null)
    {
      output.Cultivations = new List<CultivationOutput>();
      foreach (var cultivation in pond.Cultivations)
      {
        output.Cultivations.Add(CultivationOutput.FromEntity(cultivation));
      }
    }

    return output;
  }
}
