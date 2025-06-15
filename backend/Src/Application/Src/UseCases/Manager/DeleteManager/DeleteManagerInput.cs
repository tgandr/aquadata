using Aquadata.Application.Interfaces;
using MediatR;

namespace Aquadata.Application.UseCases.Manager.DeleteManager;

public class DeleteManagerInput: IUseCaseRequest<Unit>
{
  public string Phone { get; }

  public DeleteManagerInput(string phone)
    => Phone = phone;
}
