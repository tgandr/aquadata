using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Payment;
using Aquadata.Application.UseCases.Payment.Create;
using Aquadata.Core.Util;
using Aquadata.Core.Util.Result;
using MercadoPago.Client;
using MercadoPago.Client.CardToken;
using MercadoPago.Client.Common;
using MercadoPago.Client.Customer;
using MercadoPago.Client.Payment;
using MercadoPago.Config;
using MercadoPago.Resource.Customer;
using MercadoPago.Resource.Payment;
using Microsoft.Extensions.Configuration;

namespace Aquadata.Infra.Payments.MercadoPago;

public class MercadoPagoService: IPaymentGateway
{
  private readonly PaymentClient _client = new PaymentClient();
  public MercadoPagoService(
    IConfiguration configuration
  ) {
    MercadoPagoConfig.AccessToken = configuration["MercadoPago:AccessToken"];
  }

  public async Task<Result<PaymentOutput>> CreatePaymentAsync(CreatePaymentInput command)
  {
    RequestOptions _requestOptions = new RequestOptions();
     _requestOptions.CustomHeaders.Add("x-idempontency-key", Guid.NewGuid().ToString());
    try 
    {
      var request = new PaymentCreateRequest {
        Token = command.Token,
        Installments = 1,
        TransactionAmount = 100,
        Payer = new PaymentPayerRequest {
          Id = command.Id,
          Type = command.Type ?? "guest",
          Email = command.Payer.Email,
          Identification = new IdentificationRequest
          {
            Type = command.Payer.Identification.Type,
            Number = command.Payer.Identification.Number
          }
        },
      };

      Payment payment = await _client.CreateAsync(request, _requestOptions);
      if (payment.Status == PaymentStatus.Rejected)
        return Result<PaymentOutput>.Fail(
          Error.Validation(
            "Payments.MercadoPago.CreatePayment",
            "Payment rejected"
          )
      );
      return Result<PaymentOutput>.Ok(new PaymentOutput(payment.Id.ToString()!));
    }

    catch (Exception ex) 
    {
      return Result<PaymentOutput>.Fail(
        Error.Internal(
          "Payments.MercadoPago.CreatePayment",
          ex.Message
        )
      );
    }
  }

  public async Task<string> GenerateCardToken(string customerId, string cardId)
  {
    var tokenClient = new CardTokenClient();
    try 
    {
      var token =  await tokenClient.CreateAsync(new CardTokenRequest
      {
        CustomerId = customerId,
        CardId = cardId
      });
      return token.Id;
    }
    catch (Exception ex) 
    {
      Console.WriteLine(ex.Message);
      return "";
    }
  }

  public async Task<PaymentOutput> GetPaymentAsync(string paymentId)
  {
    var payment = await _client.GetAsync(long.Parse(paymentId));

    if (payment == null)
      return PaymentOutput.Empty();
      
    return new PaymentOutput(payment.Id.ToString()!, payment.Status);
  }

  public async Task<Result<(string customerId, string cardId)>> SaveCustomerAndCardIfNotExists(
    string customerEmail, 
    string identiciationType, 
    string identificationNumber,
    string cardToken
  )
  {
    var customerClient = new CustomerClient();
    var customers = await customerClient.SearchAsync(new SearchRequest 
    {
      Filters = new Dictionary<string, object>
      {
        {"email", customerEmail}
      }
    });

    if (customers.Results.Any())
    {
      var currentCustomer = customers.Results[0];
      if (!currentCustomer.Cards.Any())
      {
        var cardResult = await AddCardToCustomer(currentCustomer.Id, cardToken);
        if (cardResult.IsFail)
          return Result<(string,string)>.Fail(cardResult.Error);

        return Result<(string,string)>.Ok((currentCustomer.Id, cardResult.Unwrap()));
      }
      return Result<(string,string)>
        .Ok((currentCustomer.Id, currentCustomer.Cards[0].Id));
    }
    
    try
    {
      var currentCustomer = await customerClient.CreateAsync(new CustomerRequest{
        Email = customerEmail,
        Identification = new IdentificationRequest 
        {
          Type = identiciationType,
          Number = identificationNumber
        }
      });

      var newCard = await AddCardToCustomer(currentCustomer.Id,cardToken);

      return Result<(string,string)>.Ok((currentCustomer.Id, newCard.Unwrap()));
    }
    catch (Exception ex)
    {
      return Result<(string,string)>.Fail(
        Error.Internal(
          "Payments.MercadoPago.CreatePayment",
          ex.Message
        )
      );
    }
  }

  private async Task<Result<string>> AddCardToCustomer(string customerId, string cardToken)
  {
    var cardClient = new CustomerCardClient();
    try
    {
      var newCard = await cardClient.CreateAsync(customerId, new CustomerCardCreateRequest
      {
        Token = cardToken
      });
      return Result<string>.Ok(newCard.Id);
    }
    catch (Exception ex)
    {
      return Result<string>.Fail(
        Error.Internal(
          "Payments.MercadoPago.CreatePayment",
          ex.Message
        )
      );
    }
  }
}
