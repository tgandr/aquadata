using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Payment.Create;
using Aquadata.Core.Entities.Payment;
using Aquadata.Core.Interfaces.Repository;

namespace Aquadata.Infra.Payments.MercadoPago.Jobs;

public class RenewSubscriptionsJob
{
  private readonly ISubscriptionRepository _repository;
  private readonly IPaymentRepository _paymentRepository;
  private readonly IPaymentGateway _gateway;

  public RenewSubscriptionsJob(
    ISubscriptionRepository repository,
    IPaymentRepository paymentRepository,
    IPaymentGateway gateway
  )
  {
    _paymentRepository = paymentRepository;
    _gateway = gateway;
    _repository = repository;
  }

  public async Task Execute()
  {
    int page = 1;
    var expireds = await _repository.GetExpiredInBatches(page, 2);

    // // do 
    // // {
      foreach (var subscription in expireds)
      {
        var paymentFromDb = await _paymentRepository
          .GetByUserId(subscription.UserId);

        if (paymentFromDb is null) return;

        var token = await _gateway.GenerateCardToken(
          paymentFromDb.CustomerId, 
          paymentFromDb.CardId
        );

        var newPayment = new CreatePaymentInput
        {
          Id = paymentFromDb.CustomerId,
          Type = "customer",
          Token = token,
          Payer = new CreatePaymentInput.PayerInfo {
            Email = paymentFromDb.Email,
            Identification = new CreatePaymentInput.IdentificationInfo
            {
              Type = paymentFromDb.IdenticiationType,
              Number = paymentFromDb.IdentificationNumber
            }
          }
        };

        var paymentResult = await _gateway.CreatePaymentAsync(newPayment);
        if (paymentResult.IsFail) {
          Console.WriteLine(paymentResult.Error.Description);
          return; 
        }
        await _paymentRepository.CreateOrUpdate(new PaymentEntity(
          paymentResult.Unwrap().Id,
          paymentFromDb.CustomerId,
          paymentFromDb.CardId,
          paymentFromDb.Email,
          paymentFromDb.IdenticiationType,
          paymentFromDb.IdentificationNumber,
          subscription.UserId
        ));

        page += 1;
        Thread.Sleep(500);
      }
    // }
    // while (expireds.Count > 0);
  }
}
