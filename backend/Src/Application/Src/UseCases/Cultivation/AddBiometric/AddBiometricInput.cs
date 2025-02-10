using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation.AddBiometric;

public class AddBiometricInput: IUseCaseRequest<BiometricDto>
{
  public float Count {get; private set;}
  public float AverageWeight {get; private set;}
  public DateTime Date {get; private set;}
  public virtual Guid CultivationId {get;set;}
  
  public AddBiometricInput(float count, float averageWeight, 
  DateTime date, Guid cultivationId)
  {
      Count = count;
      AverageWeight = averageWeight;
      Date = date;
      CultivationId = cultivationId;
  }
}
