using Aquadata.Core.Entities.Biometric;
using Aquadata.Core.Entities.Cultivation;
using Aquadata.Core.Entities.Fertilizer;
using Aquadata.Core.Entities.Harvest;
using Aquadata.Core.Entities.Objective;
using Aquadata.Core.Entities.Water;

namespace Aquadata.Core.Interfaces.Repository;

public interface ICultivationRepository
{
  Task<CultivationEntity?> Get(Guid id);
  Task<bool> Exists(string userId, string cultivationId);
  Task AddObjective(ObjectiveEntity objective);
  Task AddBiometric(BiometricEntity biometric);
  Task AddWater(WaterEntity water);
  Task AddFertilizer(FertilizerEntity fertilizer);
  Task AddHarvest(HarvestEntity harvest);
}
