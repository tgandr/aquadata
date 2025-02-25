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
  Task<bool> IsEmailRegistered(string email);
  Task Insert(FinancialEntity financial);
  Task AddStock(StockEntity stock);
  Task AddInventory(InventoryEntity inventory); 
}