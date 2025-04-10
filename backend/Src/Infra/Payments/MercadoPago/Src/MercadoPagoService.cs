using Aquadata.Application.Dtos.MercadoPago;
using Aquadata.Application.Interfaces;
using MercadoPago.Client;
using MercadoPago.Client.Common;
using MercadoPago.Client.Payment;
using MercadoPago.Client.Preference;
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

}
