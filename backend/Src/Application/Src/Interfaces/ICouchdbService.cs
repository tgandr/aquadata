namespace Aquadata.Application.Interfaces;

public interface ICouchdbService
{
  Task AddUser(string email, string password);
  Task SetUserAsMember(string email);
  Task RemoveUserFromMembers(string email);
}
