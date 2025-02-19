using Aquadata.Application.Dtos;
using Aquadata.Core.Entities.User;

namespace Aquadata.Application.UseCases.User.Common;

public class UserOutput
{
  public Guid Id {get;}
  public string Name { get; }
  public string Email {get; }
  public string FarmName { get; }
  public string FarmAddress { get; }
  public string Profile { get; }
  public string Phone { get; }

  public List<FeedPurchaseDto> FeedPurchases {get;set;} = new List<FeedPurchaseDto>();
  public List<ProbioticPurchaseDto> ProbioticPurchases {get;set;} = new List<ProbioticPurchaseDto>();
  public List<FertilizerPurchaseDto> FertilizerPurchases {get;set;} = new List<FertilizerPurchaseDto>();
  public List<PLPurchaseDto> PLPurchases {get;set;} = new List<PLPurchaseDto>();
  public List<GenericPurchaseDto> GenericPurchases {get;set;} = new List<GenericPurchaseDto>();
  public List<EmployeeDto> Employees {get;set;} = new List<EmployeeDto>();
  public List<EmployeePaymentDto> Payroll {get;set;} = new List<EmployeePaymentDto>();
  public List<ExpenseDto> Expenses {get;set;} = new List<ExpenseDto>();
  public List<StockDto> Stocks {get;set;} = new List<StockDto>();
  public List<InventoryDto> Inventories {get;set;} = new List<InventoryDto>();

  public UserOutput(Guid id, string name, string email, string farmName, 
    string farmAddress, string profile, string phone)
  {
    Id = id;
    Name = name;
    Email = email;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Profile = profile;
    Phone = phone;
  }

  public static UserOutput FromEntity(UserEntity user)
  {
    var res = new UserOutput(
      user.Id,
      user.Name,
      user.Email,
      user.FarmName,
      user.FarmAddress,
      user.Profile,
      user.Phone
    );

    if (user.FeedPurchases != null
    && user.FeedPurchases.Any())
      res.FeedPurchases=user.FeedPurchases
      .Select(FeedPurchaseDto.FromEntity).ToList();

    if (user.ProbioticPurchases != null
    && user.ProbioticPurchases.Any())
      res.ProbioticPurchases=user.ProbioticPurchases
      .Select(ProbioticPurchaseDto.FromEntity).ToList();

    if (user.FertilizerPurchases != null
    && user.FertilizerPurchases.Any())
      res.FertilizerPurchases=user.FertilizerPurchases
      .Select(FertilizerPurchaseDto.FromEntity).ToList();

    if (user.PLPurchases != null
    && user.PLPurchases.Any())
      res.PLPurchases=user.PLPurchases
      .Select(PLPurchaseDto.FromEntity).ToList();

    if (user.GenericPurchases != null
    && user.GenericPurchases.Any())
      res.GenericPurchases=user.GenericPurchases
      .Select(GenericPurchaseDto.FromEntity).ToList();

    if (user.Employees != null
    && user.Employees.Any())
      res.Employees=user.Employees
      .Select(EmployeeDto.FromEntity).ToList();

    if (user.Payroll != null
    && user.Payroll.Any())
      res.Payroll=user.Payroll
      .Select(EmployeePaymentDto.FromEntity).ToList();
      
    if (user.Expenses != null
    && user.Expenses.Any())
      res.Expenses=user.Expenses
      .Select(ExpenseDto.FromEntity).ToList();

    if (user.Stocks != null
    && user.Stocks.Any())
      res.Stocks=user.Stocks
      .Select(StockDto.FromEntity).ToList();

    if (user.Inventories != null
    && user.Inventories.Any())
      res.Inventories=user.Inventories
      .Select(InventoryDto.FromEntity).ToList();
      
    return res;
  }
  
}
