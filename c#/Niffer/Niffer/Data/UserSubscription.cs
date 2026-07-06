namespace Niffer.Data
{
    public class UserSubscription
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        //到期时间
        public DateTime SubscriptionExpiry { get; set; }
    }
}
