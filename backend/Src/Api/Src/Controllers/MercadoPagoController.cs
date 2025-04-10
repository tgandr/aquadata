using System.Security.Cryptography;
using System.Text;
using Aquadata.Application.Dtos.MercadoPago;
using Aquadata.Application.Interfaces;
using MediatR;
using MercadoPago.Client.Payment;
using MercadoPago.Resource.Payment;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/process_payment")]
public class PaymentController: ControllerBase
{
  private readonly IPaymentService<PaymentCreateRequest, Payment> _paymentService;
  private readonly IConfiguration _config;
  public PaymentController(IPaymentService<PaymentCreateRequest,Payment> paymentService,
  IConfiguration config)
  {
    _paymentService = paymentService;
    _config = config;
  }

  [HttpPost]
  public async Task<IResult> ProcessPayment(
    [FromBody] PaymentCreateRequest command)
  {
    var res = await _paymentService.CreatePaymentAsync(command);

    return Results.Ok(res);
  }

  [HttpPost("webhook")]
  public IResult Webhook([FromBody] dynamic payload)
  {
    if (payload == null || string.IsNullOrEmpty(payload!.Type) || payload!.Data?.Id == null)
            return Results.BadRequest("Payload inválido");

    if (!ValidateRequest())
      return Results.BadRequest("Assinatura inválida");
    

    var json = System.Text.Json.JsonSerializer.Serialize(payload);
    Console.WriteLine(json);
    return Results.Ok();
  } 

  private bool ValidateRequest() 
  {
    var headers = Request.Headers;
    string? xSignature = headers["x-signature"];
    string? xRequestId = headers["x-request-id"];
    string? dataId = Request.Query["data.id"];

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
