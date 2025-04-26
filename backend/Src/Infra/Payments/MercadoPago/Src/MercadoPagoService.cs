using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.PaymentGateway.Common;
using Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MercadoPago.Client.Payment;
using MercadoPago.Config;
using Microsoft.Extensions.Configuration;

namespace Aquadata.Infra.Payments.MercadoPago;

public class MercadoPagoService: IPaymentGateway
{
  HttpClient client = new HttpClient();
  private string _accessToken;
  private string _backUrl;

  public MercadoPagoService(
    IConfiguration configuration
  ) {
    _accessToken = configuration["MercadoPago:AccessToken"]!;
    _backUrl = configuration["MercadoPago:BackUrl"]!;
    MercadoPagoConfig.AccessToken = _accessToken;
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
  }

  public async Task<Result<SubscriptionOutput>> CreateSubscription(CreateSubscriptionInput command)
  {
    var request = new
    {
      reason = "Assinatura Aquadata",
      payer_email = command.PayerEmail,
      external_reference = "Teste",
      auto_recurring = new {
        frequency = 1,
        frequency_type = "days",
        transaction_amount = 1,
        currency_id = "BRL"
      },
      back_url = _backUrl,
      status = "pending"
    };


    var body = JsonSerializer.Serialize(request);
    var content = new StringContent(
      body, 
      Encoding.UTF8, 
      "application/json"

    );
    var response = await client.PostAsync(
      "https://api.mercadopago.com/preapproval", 
      content
    );

    if (!response.IsSuccessStatusCode)
      return Result<SubscriptionOutput>.Fail(
      Error.Internal(
        "Payments.MercadoPago.CreatePayment",
        response.ReasonPhrase!
      )
    );

    var output = JsonSerializer.Deserialize<SubscriptionOutput>(
      await response.Content.ReadAsStringAsync(),
      new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
      }
    );
  
    if (output == null)
      return Result<SubscriptionOutput>.Fail(
      Error.Internal(
        "Payments.MercadoPago.CreatePayment",
        "subscription not authorized"
      )
    );
    
    return Result<SubscriptionOutput>.Ok(output);
  }

  public async Task<PaymentOutput?> GetPayment(string id)
  {
    var client = new PaymentClient();
    var data = await client.GetAsync(long.Parse(id));

    if (data == null) return null;

    return new PaymentOutput
    {
      Status = data.Status,
      SubscriptionId = data.Metadata["preapproval_id"].ToString() ?? ""
    };
  }
}
