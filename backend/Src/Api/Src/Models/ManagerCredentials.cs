using Aquadata.Application.UseCases.Manager.Common;

namespace Aquadata.Api.Models;

public class ManagerCredentials
{
  public ManagerOutput Manager { get; }

  public ManagerCredentials(ManagerOutput user)
  {
    Manager = user;
  }
}
