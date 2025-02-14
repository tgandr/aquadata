using Aquadata.Application.Dtos;
using Aquadata.Application.UseCases.User.Purchase.AddFeedPurchase;
using Aquadata.Application.UseCases.User.Purchase.AddFertilizerPurchase;
using Aquadata.Application.UseCases.User.Purchase.AddProbioticPurchase;
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

    return res;
  }
  
}
