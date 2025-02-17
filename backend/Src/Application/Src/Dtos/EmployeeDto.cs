using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Employee;
using MediatR;

namespace Aquadata.Application.Dtos;

public class EmployeeDto: IUseCaseRequest<Unit>
{
  public string Name {get;}

  public EmployeeDto(string name)
    => Name = name;

  public static EmployeeDto FromEntity(EmployeeEntity entity)
    => new(entity.Name);
}
