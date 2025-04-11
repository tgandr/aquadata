using Aquadata.Application.Interfaces;
using Aquadata.Core.Entities.Payment;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.Payments.MercadoPago.Helpers;
using MercadoPago.Client;
using MercadoPago.Client.Payment;
using MercadoPago.Config;
using MercadoPago.Resource.Payment;
using Microsoft.Extensions.Configuration;

namespace Aquadata.Infra.Payments.MercadoPago;

public class MercadoPagoService: IPaymentService<PaymentCreateRequest, Payment>
{
  private readonly RequestOptions _requestOptions = new RequestOptions();
  private readonly PaymentClient _client = new PaymentClient();
  public MercadoPagoService(IConfiguration configuration) 
  {
    _requestOptions.CustomHeaders.Add("x-idempontency-key", Guid.NewGuid().ToString());
    MercadoPagoConfig.AccessToken = configuration["MercadoPago:AccessToken"];
  }

  public async Task<Payment> CreatePaymentAsync(PaymentCreateRequest command)
  {
    Payment payment = await _client.CreateAsync(command, _requestOptions);
    return payment;
  }

  public async Task<Payment> GetPaymentAsync(string paymentId)
  {
    var payment = await _client.GetAsync(long.Parse(paymentId), _requestOptions);
    return payment;
  }

  public PaymentEntity ToPaymentEntity(Payment payment, Guid userId)
  {
    var status = EnumHelper.ToDomain(payment.Status);

    return new PaymentEntity(payment.Id.ToString()!, status, userId);
  }
}
