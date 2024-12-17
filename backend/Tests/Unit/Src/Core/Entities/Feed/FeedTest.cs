using Aquadata.Core.Entities.Feed;
using Aquadata.Core.Errors;

namespace Aquadata.UnitTests.Core.Entities.Feed;

public class FeedTest
{
    [Fact]
    public void CreateValidFeed()
    {
        var expected = new
        {
            Date = DateTime.Now,
            Frequency = 10,
            TotalOfDay = 30.6f,
            RationName = "RationName",
            HadLeftovers = true,
            ReducedOrSuspended = true
        };

        var current = FeedEntity.Of(
          expected.Date,
          expected.Frequency,
          expected.TotalOfDay,
          expected.RationName,
          expected.HadLeftovers,
          expected.ReducedOrSuspended
        ).Unwrap();

        Assert.NotNull(current);
        Assert.NotEqual(current.Id, default);
        Assert.Equal(expected.Date, current.Date);
        Assert.Equal(expected.Frequency, current.Frequency);
        Assert.Equal(expected.TotalOfDay, current.TotalOfDay);
        Assert.Equal(expected.RationName, current.RationName);
        Assert.Equal(expected.HadLeftovers, current.HadLeftovers);
        Assert.Equal(expected.ReducedOrSuspended, current.ReducedOrSuspended);
    }

    [Fact]
    public void GivenInvalidParamsWhenCreateThrowError()
    {
        var invalid = FeedEntity.Of(DateTime.Now, 10, 10, "", false, false);

        Assert.Throws<ModelValidationException>(() =>
        {
            invalid.Unwrap();
        });
    }
}
