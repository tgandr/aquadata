namespace Aquadata.Infra.Payments.MercadoPago.Models;

public class PaymentWebhook
{
    public string Action { get; set; }

    public string ApiVersion { get; set; }

    public PaymentData Data { get; set; }

    public DateTime DateCreated { get; set; }

    public long Id { get; set; }

    public bool LiveMode { get; set; }

    public string Type { get; set; }

    public string UserId { get; set; }
}

public class PaymentData
{
    public string Id { get; set; }
}