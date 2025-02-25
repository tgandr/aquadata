using Aquadata.Application.Dtos;
using Aquadata.Core.Entities.Financial;

namespace Aquadata.Application.UseCases.Financial.Common;

public class FinancialOutput
{
  public List<FeedPurchaseDto> FeedPurchases {get;set;}
  public List<ProbioticPurchaseDto> ProbioticPurchases {get;set;}
  public List<FertilizerPurchaseDto> FertilizerPurchases {get;set;}
  public List<PLPurchaseDto> PLPurchases {get;set;}
  public List<GenericPurchaseDto> GenericPurchases {get;set;}
  public List<EmployeeDto> Employees {get;set;}
  public List<EmployeePaymentDto> Payroll {get;set;}
  public List<ExpenseDto> Expenses {get;set;}

  public static FinancialOutput FromEntity(FinancialEntity financial)
  {
    return new FinancialOutput
    {
      FeedPurchases = financial.FeedPurchases.Select(FeedPurchaseDto.FromEntity).ToList(),
      ProbioticPurchases = financial.ProbioticPurchases.Select(ProbioticPurchaseDto.FromEntity).ToList(),
      FertilizerPurchases = financial.FertilizerPurchases.Select(FertilizerPurchaseDto.FromEntity).ToList(),
      PLPurchases = financial.PLPurchases.Select(PLPurchaseDto.FromEntity).ToList(),
      GenericPurchases = financial.GenericPurchases.Select(GenericPurchaseDto.FromEntity).ToList(),
      Employees = financial.Employees.Select(EmployeeDto.FromEntity).ToList(),
      Payroll = financial.Payroll.Select(EmployeePaymentDto.FromEntity).ToList(),
      Expenses = financial.Expenses.Select(ExpenseDto.FromEntity).ToList(),
    };
  }
}
