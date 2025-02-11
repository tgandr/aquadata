using Aquadata.Core.Entities.Fertilizer;
using Aquadata.Core.Enums;

namespace Aquadata.Application.Dtos;

public class FertilizerDto
{
  public string Name {get;}
  public DateTime Date {get;}
  public FertilizerType Type {get;}
  public int Quantity {get;}
  public MeasureUnit MeasureUnit {get;}

  public FertilizerDto(string name, DateTime date, FertilizerType type, int quantity, MeasureUnit measureUnit)
  {
      Name = name;
      Date = date;
      Type = type;
      Quantity = quantity;
      MeasureUnit = measureUnit;
  }

  public static FertilizerDto FromEntity(FertilizerEntity entity)
    => new(entity.Name, entity.Date, entity.Type, entity.Quantity, 
  entity.MeasureUnit);
}
