using Aquadata.Application.Interfaces;
using CouchDB.Driver;
using CouchDB.Driver.Options;
using CouchDB.Driver.Types;

namespace Aquadata.Infra.CouchDb;

public class AquadataCouchDb : CouchContext, ICouchdbService
{
  public AquadataCouchDb(CouchOptions<AquadataCouchDb> options) : base(options)
  {}
  
  public async Task AddUser(string email, string password)
  {
    var usersDb = Client.GetUsersDatabase();
    var newUser = new CouchUser(email, password);

    await usersDb.AddAsync(newUser);
  }
}
