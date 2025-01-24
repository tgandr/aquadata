using Aquadata.Application.Interfaces;
using Aquadata.Core.Enums;
using MediatR;

namespace Aquadata.Application.UseCases.Cultivation;

public class AddCultivationInput: IApplicationRequest<Unit>
{
  public int PondNumber {get; set;}
  public int Stock {get; set;}
  public string PLOrigin {get; set;}
  public CultivationUniformity Uniformity {get; set;}
  public DateTime SettlementDate {get; set;}
  public bool WaterAndAcclimationChecked {get; set;}
  public Guid PondId {get;set;}

  public AddCultivationInput(
    int pondNumber,
    int stock,
    string plOrigin,
    CultivationUniformity uniformity,
    DateTime settlementDate,
    bool waterAndAcclimationChecked,
    Guid pondId
  )
  {
    PondNumber = pondNumber;
    Stock = stock;
    PLOrigin = plOrigin;
    Uniformity = uniformity;
    SettlementDate = settlementDate;
    WaterAndAcclimationChecked = waterAndAcclimationChecked;
    PondId = pondId;
  }
}
