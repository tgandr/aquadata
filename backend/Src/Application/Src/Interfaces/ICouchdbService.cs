namespace Aquadata.Application.Interfaces;

public interface ICouchdbService
{
  Task AddUserAndCreateDb(string email, string password);
  Task AddUser(string email, string password);
  Task SetUserAsMember(string email);
  Task RemoveUserFromMembers(string email);
  Task AddMemberToDb(string member, string db);
  Task AddDataToDb(string user, object data);
  Task UpdateData(string user, object data);
}
