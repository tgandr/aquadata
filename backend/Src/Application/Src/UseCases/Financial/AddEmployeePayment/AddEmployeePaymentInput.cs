using Aquadata.Application.Interfaces;
using MediatR;

namespace Aquadata.Application.UseCases.Financial.AddEmployeePayment;

public class AddEmployeePaymentInput: IUseCaseRequest<Unit>
{
  public string Date {get;}
  public decimal Value {get;}
  public Guid EmployeeId {get;}

  public AddEmployeePaymentInput(string date, 
  decimal value, Guid employeeId)
  {
    Date = date;
    Value = value;
    EmployeeId = employeeId;
  }
}
