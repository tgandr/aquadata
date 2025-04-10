using System.Text.Json.Serialization;
using Aquadata.Application.Dtos.MercadoPago;
using Aquadata.Application.Interfaces;
using MediatR;

public class CardPaymentDto: PaymentBase, IRequest<string>
{
  public CardPaymentDto(string paymentMethodId, decimal transactionAmount)
  :base(paymentMethodId, transactionAmount)
  {}

  [JsonPropertyName("token")]
  public string Token { get; set; }

  [JsonPropertyName("issuer_id")]
  public string IssuerId { get; set; }

  [JsonPropertyName("payment_method_option_id")]
  public string? PaymentMethodOptionId { get; set; }

  [JsonPropertyName("processing_mode")]
  public string? ProcessingMode { get; set; }

  [JsonPropertyName("installments")]
  public int Installments { get; set; }
  
  public PayerInfo Payer { get; set; }
}

public class PayerInfo
{
  public string Email { get; set; }
  public IdentificationInfo Identification { get; set; }
}

public class IdentificationInfo
{
  public string Type { get; set; }
  public string Number { get; set; }
}