using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Manager.Common;

namespace Aquadata.Application.UseCases.Manager.GetManager;

public class GetManagerInput: IUseCaseRequest<ManagerOutput>
{
  public string Phone { get; }
  public GetManagerInput(string phone)
  {
    Phone = phone;
  }
}
