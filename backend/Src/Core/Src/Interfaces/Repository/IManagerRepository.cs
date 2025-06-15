using Aquadata.Core.Entities.Manager;

namespace Aquadata.Core.Interfaces.Repository;

public interface IManagerRepository
{
  Task<ManagerEntity?> GetByPhone(string phone);
  Task Create(ManagerEntity manager);
  Task Delete(ManagerEntity manager);
}
