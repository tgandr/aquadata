using System.Text.Json.Serialization;
using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Core.Enums;

namespace Aquadata.Application.UseCases.Cultivation.AddFertilizer;

public class AddFertilizerInput: IUseCaseRequest<FertilizerDto>
{
  public string Name {get;}
  public DateTime Date {get;}
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public FertilizerType Type {get;}
  public int Quantity {get;}
  
  [JsonConverter(typeof(JsonStringEnumConverter))]
  public MeasureUnit MeasureUnit {get;}
  public Guid CultivationId {get;}

  public AddFertilizerInput(string name, DateTime date, FertilizerType type, 
  int quantity, MeasureUnit measureUnit, Guid cultivationId)
  {
    Name = name;
    Date = date;
    Type = type;
    Quantity = quantity;
    MeasureUnit = measureUnit;
    CultivationId = cultivationId;
  }
}
