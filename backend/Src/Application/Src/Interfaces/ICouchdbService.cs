namespace Aquadata.Application.Interfaces;

public interface ICouchdbService
{
  Task AddUser(string email, string password);
}
