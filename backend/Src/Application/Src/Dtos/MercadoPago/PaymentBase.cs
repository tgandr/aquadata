using System.Text.Json.Serialization;

namespace Aquadata.Application.Dtos.MercadoPago;

public abstract class PaymentBase
{
  [JsonPropertyName("payment_method_id")]
  public string PaymentMethodId { get; set; }

  [JsonPropertyName("transaction_amount")]
  public decimal TransactionAmount { get; set; }

  protected PaymentBase(string paymentMethodId, decimal transactionAmount)
  {
    PaymentMethodId = paymentMethodId;
    TransactionAmount = transactionAmount;
  }
}

public class Payer
{
    [JsonPropertyName("email")]
    public string Email { get; set; }

    [JsonPropertyName("identification")]
    public Identification? Identification { get; set; }

    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    [JsonPropertyName("address")]
    public Address? Address { get; set; }
}

