using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;

namespace Aquadata.Application.UseCases.Cultivation.AddHarvest;

public class AddHarvestInput: IUseCaseRequest<HarvestDto>
{
  public string Buyer {get;}
  public decimal Price {get;}
  public DateTime Date {get;}
  public bool IsTotal {get;}
  public float BioMass {get;}
  public List<BiometricDto> Biometrics {get;set;}
  public Guid CultivationId {get;}

  public AddHarvestInput(string buyer, decimal price, 
  DateTime date, bool isTotal, float bioMass, List<BiometricDto> biometrics,
  Guid cultivationId)
  {
    Buyer = buyer;
    Price = price;
    Date = date;
    IsTotal = isTotal;
    BioMass = bioMass;
    Biometrics = biometrics;
    CultivationId = cultivationId;
  }
}
