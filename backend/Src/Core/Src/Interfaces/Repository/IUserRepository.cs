using Aquadata.Core.Entities.Financial;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Entities.Stock;
using Aquadata.Core.Entities.User;
using Aquadata.Core.SeedWork;

namespace Aquadata.Core.Interfaces.Repository;

public interface IUserRepository: IGenericRepository<UserEntity>
,IDeletableRepository<UserEntity>
{
  Task<UserEntity?> GetByEmail(string email);
  Task<bool> Exists(string email);
  Task<bool> Exists(Guid userId);
  Task Insert(FinancialEntity financial);
  Task AddStock(StockEntity stock);
  Task AddInventory(InventoryEntity inventory); 
  Task<ICollection<InventoryEntity>> GetInventories(Guid userId);
  Task<ICollection<StockEntity>> GetStocks(Guid userId);
}