using Aquadata.Core.Entities.User;
using Aquadata.Core.SeedWork;

namespace Aquadata.Core.Interfaces.Repository;

public interface IUserRepository: IGenericRepository<UserEntity>
,IDeletableRepository<UserEntity>
{}