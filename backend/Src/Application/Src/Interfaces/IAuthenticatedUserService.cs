namespace Aquadata.Application.Interfaces;

public interface IAuthenticatedUserService
{
  Guid GetUserId();
  string GetUserEmail();
}
