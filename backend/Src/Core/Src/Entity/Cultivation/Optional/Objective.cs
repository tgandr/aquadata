namespace Aquadata.Core.Entity.Cultivation;

public class Objective
{
  public int Days {get;}
  public float AverageSize {get;}
  public float SurvivalRate {get;}

  public Objective(int days, float averageSize, float survivalRate)
  {
    Days = days;
    AverageSize = averageSize;
    SurvivalRate = survivalRate;
  }
}
