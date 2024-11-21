using Aquadata.Core.Builders;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Enums;
using Aquadata.Core.Errors;

namespace Aquadata.UnitTests.Core.Entity.Cultivation;

public class CultivationTest
{
  [Fact]
  public void CreateValidCultivation()
  {
    var cultivationOptional = 
      new CultivationOptionalBuilder()
      .StressTest(
        "type", 
        DeadLarvae.Many, 
        SwimmingResponse.None
      )
      .WaterAndAcclimation(
        oxygen: 10.4f,
        temperature: 30,
        pH: 10,
        salinity: 56,
        ammonium: 20,
        nitrite: 10
      )
      .Objective(2, 56.6f, 35.7f).Build();
  
    var expected = new {
      PondNumber = 1,
      Stock = 12000,
      PLOrigin = "example",
      Uniformity = CultivationUniformity.Good,
      WaterAndAcclimationChecked = false,
      SettlementDate = DateTime.Now,
      Optional = cultivationOptional
    };

    var current = CultivationEntity.Of(
      pondNumber: expected.PondNumber,
      stock: expected.Stock,
      pLOrigin: expected.PLOrigin,
      uniformity: expected.Uniformity,
      waterAndAcclimationChecked: expected.WaterAndAcclimationChecked,
      settlementDate: expected.SettlementDate,
      optional: expected.Optional
    ).Unwrap();

    Assert.NotNull(current);
    Assert.NotEqual(current.Id, default);
    Assert.Equal(expected.PondNumber, current.PondNumber);
    Assert.Equal(expected.PLOrigin, current.PLOrigin);
    Assert.Equal(expected.Stock, current.Stock);
    Assert.Equal(expected.Uniformity, current.Uniformity);
    Assert.Equal(expected.SettlementDate, current.SettlementDate);
    Assert.NotEqual(expected.WaterAndAcclimationChecked, current.WaterAndAcclimationChecked);
    Assert.Equivalent(expected.Optional.StressTest, current.Optional?.StressTest);
    Assert.Equivalent(expected.Optional.WaterAndAcclimation, current.Optional?.WaterAndAcclimation);
    Assert.Equivalent(expected.Optional.Objective, current.Optional?.Objective);
  }

  [Fact]
  public void GivenInvalidParamsWhenCreateThrowError()
  {
    var cultivation = new {
      WithInvalidUniformity = GetCultivation.WithInvalidPLOrigin()
    };

    Assert.Throws<ModelValidationException>(() => {
      cultivation.WithInvalidUniformity.Unwrap();
    });
  }

  [Fact]
  public void HasShrimpMethodTest()
  {
    var cultivation = new {
      withStock = GetCultivation.Valid(),
      WithInvalidStock = GetCultivation.WithInvalidStock()
    };

    Assert.True(cultivation.withStock.HasShrimp());
    Assert.False(cultivation.WithInvalidStock.HasShrimp());
  }
}
