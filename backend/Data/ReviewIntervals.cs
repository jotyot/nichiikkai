namespace NIKAPI.Data;

public interface IReviewIntervals
{
    public int BindLevel(int level);
    public DateOnly GetNextReviewDay(int level);
}

public class DefaultReviewIntervals : IReviewIntervals
{
    private Dictionary<int, int> Intervals = new Dictionary<int, int>
    {
        {1, 1},
        {2, 2},
        {3, 7},
        {4, 16},
        {5, 35},
        {6, 70},
        {7, 180},
    };

    public int BindLevel(int level)
    {
        return Math.Max(Intervals.Keys.Min(), Math.Min(Intervals.Keys.Max() + 1, level));
    }

    public DateOnly GetNextReviewDay(int level)
    {
        try
        {
            return DateOnly.FromDateTime(DateTime.Now.AddDays(Intervals[level]));
        }
        catch
        {
            return DateOnly.MaxValue;
        }
    }
}