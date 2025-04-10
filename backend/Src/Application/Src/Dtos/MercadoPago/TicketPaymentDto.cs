using System.Text.Json.Serialization;
using Aquadata.Application.Interfaces;
using MediatR;

namespace Aquadata.Application.Dtos.MercadoPago;

public class TicketPaymentDto: PaymentBase, IRequest<string>
{
  public TicketPaymentDto(decimal transactionAmount) 
  :base("bolbradesco", transactionAmount)
  {
  }

  [JsonPropertyName("transaction_details")]
  public TransactionDetails? TransactionDetails { get; set; }

  [JsonPropertyName("payer")]
  public Payer Payer { get; set; }

  [JsonPropertyName("metadata")]
  public Metadata? Metadata { get; set; }

  [JsonPropertyName("additional_info")]
  public AdditionalInfo? AdditionalInfo {get;set;}
}

public class TransactionDetails
{
    [JsonPropertyName("financial_institution")]
    public string FinancialInstitution { get; set; }
}

public class Identification
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("number")]
    public string Number { get; set; }
}

public class Address
{
    [JsonPropertyName("city")]
    public string City { get; set; }

    [JsonPropertyName("federal_unit")]
    public string FederalUnit { get; set; }

    [JsonPropertyName("neighborhood")]
    public string Neighborhood { get; set; }

    [JsonPropertyName("street_name")]
    public string StreetName { get; set; }

    [JsonPropertyName("street_number")]
    public string StreetNumber { get; set; }

    [JsonPropertyName("zip_code")]
    public string ZipCode { get; set; }
}

public class Metadata
{
    [JsonPropertyName("payment_point")]
    public string? PaymentPoint { get; set; }

    [JsonPropertyName("payment_mode")]
    public string? PaymentMode { get; set; }
}

public class AdditionalInfo
{
  public AdditionalInfoPayer Payer { get; set; }
}

public class AdditionalInfoPayer
{
  [JsonPropertyName("first_name")]
  public string FirstName { get; set; }

  [JsonPropertyName("last_name")]
  public string LastName { get; set; }
  public AdditionalInfoAddres Address { get; set; }
}
public class AdditionalInfoAddres
{
  [JsonPropertyName("street_name")]
  public string StreetName { get; set; }

  [JsonPropertyName("street_number")]
  public string StreetNumber { get; set; }

  [JsonPropertyName("zip_code")]
  public string ZipCode { get; set; }
}