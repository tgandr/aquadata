namespace Aquadata.Application.Dtos.MercadoPago;

public class PixPaymentDto : PaymentBase
{
  public Payer Payer {get;set;}

  public PixPaymentDto(Payer payer, string paymentMethodId, decimal transactionAmount) 
  :base(paymentMethodId, transactionAmount)
  {
    Payer = payer;
  }
}
