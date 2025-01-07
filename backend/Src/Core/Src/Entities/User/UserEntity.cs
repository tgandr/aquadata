using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Entities.Stock;
using Aquadata.Core.Interfaces;
using Aquadata.Core.SeedWork;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;

namespace Aquadata.Core.Entities.User;

public class UserEntity :Entity, IAggregateRoot
{
  public string Name {get; private set;}
  public string Email {get; private set;}
  public string Profile {get; private set;}
  public string Password {get; private set;}
  public string FarmName {get; private set;}
  public string FarmAddress {get; private set;}
  public string Phone {get; private set;}

  public virtual StockEntity? Stock {get;set;}
  public virtual InventoryEntity? Inventory {get;set;}
  public virtual ICollection<PondEntity>? Ponds {get;set;} 
  public virtual ICollection<ExpenseEntity>? Expenses {get;set;}
  public virtual ICollection<EmployeeEntity>? Employees {get;set;}
  public virtual ICollection<EmployeePaymentEntity>? Payroll {get;set;}
  public virtual ICollection<FeedPurchaseEntity>? FeedPurchases {get;set;}
  public virtual ICollection<FertilizerPurchaseEntity>? FertilizerPurchases {get;set;}
  public virtual ICollection<PostLarvaePurchaseEntity>? PLPurchases {get;set;}
  public virtual ICollection<ProbioticsPurchaseEntity>? ProbioticPurchases {get;set;}
  public virtual ICollection<GenericPurchaseEntity>? GenericPurchases {get;set;}

  private UserEntity() {}
  private UserEntity(string name, string email, string password, string profile, 
  string farmName, string farmAddress, string phone)
  {
    Name = name;
    Email = email;
    Password = password;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Phone = phone;
    Profile = profile;
  }

  public static Result<UserEntity> Of(
    string name, string email, string  password, string profile,
    string farmName, string farmAddress, string phone) 
  => Create (new UserEntity(name, email, password, profile, 
    farmName, farmAddress, phone));
  

  public Result<UserEntity> Update(string name, string email, string password, string profile,
    string farmName, string farmAddress, string phone)
  {

    Name = name;
    Email = email;
    Password = password;
    FarmName = farmName;
    FarmAddress = farmAddress;
    Phone = phone;
    Profile = profile;
    
    var validateResult = Validate();
    if (validateResult.IsFail)
      return Result<UserEntity>.Fail(validateResult.Error!); 
      
    return Result<UserEntity>.Ok(this);
  }

  protected override Result<Entity> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Name cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(Email))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Email cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(Password))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Password cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(FarmName))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "FarmName cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(FarmAddress))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "FarmAddress cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(Phone))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Phone cannot be null or Empty"
        )
      );
    if (string.IsNullOrWhiteSpace(Profile))
      return Result<Entity>.Fail(
        Error.Validation(
          "Core.User",
          "Profile cannot be null or Empty"
        )
      );
    return Result<Entity>.Ok(this); 
  }
}
