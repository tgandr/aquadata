using Aquadata.Core.Entities.Employee;
using Aquadata.Core.Entities.EmployeePayment;
using Aquadata.Core.Entities.Expense;
using Aquadata.Core.Entities.Inventory;
using Aquadata.Core.Entities.Pond;
using Aquadata.Core.Entities.Purchase;
using Aquadata.Core.Entities.Stock;
using Aquadata.Core.Errors;
using Aquadata.Core.Interfaces;
using Aquadata.Core.Util;

namespace Aquadata.Core.Entities.User;

public class UserEntity : SeedWork.Entity, IAggregateRoot
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
  private UserEntity(string name, string email, string profile, string password, 
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

  public static Result<UserEntity, ModelValidationException> Of(
    string name, string email, string  profile, string password,
    string farmName, string farmAddress, string phone) 
  => Create (new UserEntity(name, email, profile, password, 
    farmName, farmAddress, phone));
  

  protected override Result<ModelValidationException> Validate()
  {
    if (string.IsNullOrWhiteSpace(Name))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User name cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Email))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User email cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Password))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User password cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(FarmName))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User farmName cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(FarmAddress))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User farmAddress cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Phone))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User phone cannot be null or Empty")
      );
    if (string.IsNullOrWhiteSpace(Profile))
      return Result<ModelValidationException>.Fail(
        new ModelValidationException("User profile cannot be null or Empty")
      );
    return Result<ModelValidationException>.Ok(); 
  }
}
