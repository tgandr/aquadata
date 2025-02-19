using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Expense;
using MediatR;

namespace Aquadata.Application.Dtos;

public class ExpenseDto: IUseCaseRequest<Unit>
{
  public string Date {get;}
  public string Description {get;}
  public List<CostPerPondDto> CostsPerPonds {get;}
  public ExpenseDto(string date, string description, 
  List<CostPerPondDto> costsPerPonds)
  {
    Date = date;
    Description = description;
    CostsPerPonds = costsPerPonds;
  }

  public static ExpenseDto FromEntity(ExpenseEntity entity)
  {
    var costs = new List<CostPerPondDto>();
    
    if (entity.CostsPerPond != null &&
    entity.CostsPerPond.Any())
     costs = entity.CostsPerPond.Select(
      CostPerPondDto.FromEntity
    ).ToList();
    
    var expense = new ExpenseDto(entity.Date.ToString(), 
    entity.Description, costs);

    return expense;
  }
}
