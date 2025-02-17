using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Entities.User;
using Aquadata.Core.SeedWork;

namespace Aquadata.Core.Interfaces.Repository;

public interface IUserRepository: IGenericRepository<UserEntity>
,IDeletableRepository<UserEntity>
{
  Task<UserEntity?> GetByEmail(string email);
  Task<bool> IsEmailRegistered(string email);
  Task AddFeedPurchase(FeedPurchaseEntity feedPurchase);
  Task AddProbioticPurchase(ProbioticsPurchaseEntity probioticPurchase);
  Task AddFertilizerPurchase(FertilizerPurchaseEntity fertilizerPurchase);
  Task AddPLPurchase(PostLarvaePurchaseEntity pLPurchase);
  Task AddGenericPurchase(GenericPurchaseEntity genericPurchase);
}