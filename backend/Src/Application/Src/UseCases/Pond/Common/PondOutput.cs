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
    => new(pond.Id, pond.Name, pond.Area, pond.IsActive, 
    pond.CreatedAt, pond.UpdatedAt, pond.UserId);
}
