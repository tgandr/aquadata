using Aquadata.Core.Entities.Harvest;

namespace Aquadata.Application.Dtos;

public class HarvestDto
{
  public string Buyer {get;}
  public decimal Price {get;}
  public DateTime Date {get;}
  public bool IsTotal {get;}
  public float BioMass {get;}
  public List<BiometricDto> Biometrics {get;set;}

  public HarvestDto(string buyer, decimal price, 
  DateTime date, bool isTotal, float bioMass, List<BiometricDto> biometrics)
  {
    Buyer = buyer;
    Price = price;
    Date = date;
    IsTotal = isTotal;
    BioMass = bioMass;
    Biometrics = biometrics;
  }

  public static HarvestDto FromEntity(HarvestEntity entity)
  {
    var res = new HarvestDto(entity.Buyer, entity.Price, 
    entity.Date, entity.IsTotal, entity.BioMass, new List<BiometricDto>());

    if (entity.Biometrics != null
    && entity.Biometrics.Any())
      res.Biometrics = entity.Biometrics
      .Select(BiometricDto.FromEntity).ToList();
      
    return res;
  }
}
