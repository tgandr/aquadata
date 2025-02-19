using Aquadata.Core.Entities.EmployeePayment;

namespace Aquadata.Application.Dtos;

public class EmployeePaymentDto
{
  public string Date {get;}
  public decimal Value {get;}

  public EmployeePaymentDto(string date, decimal value)
  {
    Date = date;
    Value = value;
  }

  public static EmployeePaymentDto FromEntity(EmployeePaymentEntity entity)
    => new(entity.Date.ToString(), entity.Value);
  
}
