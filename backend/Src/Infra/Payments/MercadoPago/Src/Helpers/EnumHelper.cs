using MercadoPago.Resource.Payment;
using Enums = Aquadata.Core.Enums;

namespace Aquadata.Infra.Payments.MercadoPago.Helpers;

public static class EnumHelper
{
  public static Enums.PaymentStatus ToDomain(string status)
  {
    return status switch
    {
      PaymentStatus.Approved => Enums.PaymentStatus.APPROVED,
      PaymentStatus.InProcess => Enums.PaymentStatus.IN_PROCESS,
      PaymentStatus.Pending => Enums.PaymentStatus.PENDING,
      PaymentStatus.Rejected => Enums.PaymentStatus.REJECTED,
      PaymentStatus.Cancelled => Enums.PaymentStatus.CANCELLED,
      PaymentStatus.Authorized => Enums.PaymentStatus.AUTHORIZED,
      PaymentStatus.InMediation => Enums.PaymentStatus.IN_MEDIATION,
      PaymentStatus.ChargedBack => Enums.PaymentStatus.CHARGED_BACK,
      _ => Enums.PaymentStatus.UNKNOWN
    };
  }

  public static string ToMercadoPago(Enums.PaymentStatus status)
  {
    return status switch
    {
      Enums.PaymentStatus.APPROVED => PaymentStatus.Approved,
      Enums.PaymentStatus.IN_PROCESS => PaymentStatus.InProcess,
      Enums.PaymentStatus.PENDING => PaymentStatus.Pending,
      Enums.PaymentStatus.REJECTED => PaymentStatus.Rejected,
      Enums.PaymentStatus.CANCELLED => PaymentStatus.Cancelled,
      Enums.PaymentStatus.AUTHORIZED => PaymentStatus.Authorized,
      Enums.PaymentStatus.IN_MEDIATION => PaymentStatus.InMediation,
      Enums.PaymentStatus.CHARGED_BACK => PaymentStatus.ChargedBack,
      _ => "UNKNOWN"
    };
  }
}
