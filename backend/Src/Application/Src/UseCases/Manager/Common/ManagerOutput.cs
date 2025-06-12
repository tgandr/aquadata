using Aquadata.Application.UseCases.User.Common;
using Aquadata.Core.Entities.Manager;

namespace Aquadata.Application.UseCases.Manager.Common;

public class ManagerOutput
{
  public Guid Id { get; }
  public string Name { get; }
  public string Phone { get; }
  public UserOutput Producer { get; set; }

  public ManagerOutput(Guid id, string name, string phone)
  {
    Id = id;
    Name = name;
    Phone = phone;
  }

  public static ManagerOutput FromEntity(ManagerEntity entity)
  {
    var manager = new ManagerOutput(entity.Id, entity.Name, entity.Phone);
    var producerOutput = UserOutput.FromEntity(entity.Producer);
    manager.Producer = producerOutput;

    return manager;
  }
}
