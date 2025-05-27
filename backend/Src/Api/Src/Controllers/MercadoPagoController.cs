using System.Security.Cryptography;
using System.Text;
using Aquadata.Api.Extensions;
using Aquadata.Application.UseCases.PaymentGateway.CreateSubscription;
using Aquadata.Application.UseCases.Payment.HandleWebHook;
using Aquadata.Infra.Payments.MercadoPago.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Aquadata.Api.Controllers;

[Route("/process_payment")]
public class PaymentController: ControllerBase
{
  private readonly IConfiguration _config;
  private readonly IMediator _mediator;

  public PaymentController(
    IConfiguration config,
    IMediator mediator)
  {
    _config = config;
    _mediator = mediator;
  }

  [HttpPost]
  [Authorize]
  public async Task<IResult> CreatePayment(
    [FromBody] CreateSubscriptionInput command)
  {
    var paymentResult = await _mediator.Send(command);
    if (paymentResult.IsFail)
      return Results.Extensions.MapResult(paymentResult);

    return Results.Ok(paymentResult.Unwrap());
  }

  [HttpPost("webhook")]
  public async Task<IResult> Webhook([FromBody] JsonDocument payload)
  {
    var root = payload.RootElement;
    
    if (!root.TryGetProperty("data", out var data)
      || !data.TryGetProperty("id", out var dataId)
      || !root.TryGetProperty("type", out var type))
    {
      return Results.BadRequest("Payload inválido");
    }

    if (!RequestIsValid(dataId.GetString()!))
      return Results.BadRequest("Assinatura inválida");

    var input = new PaymentWebHookInput(dataId.GetString()!, type.GetString()!);
    await _mediator.Send(input);

    return Results.Ok();
  } 

  private bool RequestIsValid(string dataId) 
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
