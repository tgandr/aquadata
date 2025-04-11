using System.Security.Cryptography;
using System.Text;
using Aquadata.Api.Extensions;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Payment;
using Aquadata.Core.Entities.Subscription;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.Payments.MercadoPago.Models;
using MercadoPago.Client.Payment;
using MercadoPago.Resource.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Authorize]
[Route("/process_payment")]
public class PaymentController: ControllerBase
{
  private readonly IConfiguration _config;
  private readonly IPaymentService<PaymentCreateRequest, Payment> _paymentService;
  private readonly IAuthenticatedUserService _authenticatedUserService;
  private readonly IUserRepository _userRepository;
  private readonly ISubscriptionRepository _subscriptionRepository;
  private readonly ICouchdbService _couchdbService;

  public PaymentController(
    IConfiguration config,
    IPaymentService<PaymentCreateRequest, Payment> paymentService,
    IAuthenticatedUserService authenticatedUserService,
    ISubscriptionRepository subscriptionRepository,
    ICouchdbService couchdbService,
    IUserRepository userRepository)
  {
    _subscriptionRepository = subscriptionRepository;
    _couchdbService = couchdbService;
    _config = config;
    _paymentService = paymentService;
    _authenticatedUserService = authenticatedUserService;
    _userRepository = userRepository;
  }

  [HttpPost]
  public async Task<IResult> CreatePayment(
    [FromBody] PaymentCreateRequest command)
  {
    var useCase = new CreatePayment<PaymentCreateRequest, Payment>(
      _paymentService,
      _userRepository,
      _authenticatedUserService
    );

    var paymentResult = await useCase.ExecuteAsync(command);

    if (paymentResult.IsFail)
      return Results.Extensions.MapResult(paymentResult);

    return Results.Ok(paymentResult.Unwrap());
  }

  [HttpPost("webhook")]
  public async Task<IResult> Webhook([FromBody] PaymentWebhook payload)
  {
    if (!IsAuthRequest(payload.Data.Id))
      return Results.BadRequest("Assinatura inválida");
  
    switch(payload.Type)
    {
      case "payment":
        var payment = await _paymentService.GetPaymentAsync(payload.Data.Id);
        if (payment.Status == "approved") {
          // Adicionar usuario para poder manipular o couchDB
          // Adicionar o objeto de assinatura ao banco
          var email = _authenticatedUserService.GetUserEmail();
          var userId = _authenticatedUserService.GetUserId();
          await _couchdbService.SetUserAsMember(email);
          await _subscriptionRepository.Create(
            new SubscriptionEntity(userId)
          );
        }
        break;
      default:
        return Results.Ok();
    }
    return Results.Ok();
  } 

  private bool IsAuthRequest(string dataId) 
  {
    var headers = Request.Headers;
    string? xSignature = headers["x-signature"];
    string? xRequestId = headers["x-request-id"];

    if (string.IsNullOrEmpty(xSignature) 
    || string.IsNullOrEmpty(xRequestId) 
    || string.IsNullOrEmpty(dataId))
    {
      return false;
    }

    var parts = xSignature.Split(",");
    string ts = "";
    string hash = "";

    foreach (var part in parts)
    {
      var keyValue = part.Split('=');
      if (keyValue.Length == 2)
      {
        var key = keyValue[0].Trim();
        var value = keyValue[1].Trim();

        if (key == "ts")
        {
            ts = value;
        }
        else if (key == "v1")
        {
            hash = value;
        }
      }
    }
    var secret = _config["MercadoPago:SecretSignature"];

    // Monta a string de manifesto
    var manifest = $"id:{dataId};request-id:{xRequestId};ts:{ts};";

    // Cria a assinatura HMAC SHA256
    using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret!)))
    {
        var manifestBytes = Encoding.UTF8.GetBytes(manifest);
        var hashBytes = hmac.ComputeHash(manifestBytes);
        var sha = BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();

        return sha == hash;
    }
  }
}
