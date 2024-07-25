using Microsoft.AspNetCore.Identity;

namespace NIKAPI.Data;

public class NIKUser : IdentityUser
{
    public List<string> SelectedLevels { get; set; } = new List<string>(["N3"]);

    public ICollection<UserWord> UserWords { get; set; } = new List<UserWord>();
}

public class UserWord
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required NIKUser User { get; set; }
    public required string Word { get; set; }
    public int Level { get; set; } = 1;
    public DateOnly NextReviewDay { get; set; } = DateOnly.FromDateTime(DateTime.Now.AddDays(1));
    public List<string> UserSynonyms { get; set; } = new List<string>();
}

