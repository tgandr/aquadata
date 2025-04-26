using Aquadata.Core.Entities.Payment;
using Aquadata.Core.Interfaces.Repository;
using Aquadata.Infra.EF.Context;
using Microsoft.EntityFrameworkCore;

namespace Aquadata.Infra.EF.Repositories;

public class PaymentRepository: IPaymentRepository
{
  private readonly ApplicationDbContext _dbContext;

  public PaymentRepository(ApplicationDbContext dbContext)
    => _dbContext = dbContext;

  public async Task CreateOrUpdate(PaymentEntity command)
  {
    var payment = await _dbContext.Payments
      .FirstOrDefaultAsync(p => p.UserId == command.UserId);
    
    if (payment is null)
      await _dbContext.Payments.AddAsync(command);
    else 
    {
      payment.Update(
        command.PaymentId,
        command.CustomerId,
        command.CardId,
        command.Email,
        command.IdenticiationType,
        command.IdentificationNumber
      );
      _dbContext.Payments.Update(payment!);
    }
    await _dbContext.SaveChangesAsync();
  }

  public async Task<PaymentEntity?> GetByPaymentId(string paymentId)
    => await _dbContext.Payments.Include(p => p.User)
    .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

  public async Task<PaymentEntity?> GetByUserId(Guid userId)
    => await _dbContext.Payments.Where(s => s.UserId == userId)
      .FirstOrDefaultAsync();
}
