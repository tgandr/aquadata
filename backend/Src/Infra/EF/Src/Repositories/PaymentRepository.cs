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

  public async Task Create(PaymentEntity command)
  {
    await _dbContext.Payments.AddAsync(command);
    await _dbContext.SaveChangesAsync();
  }

  public async Task<PaymentEntity?> Get(string paymentId)
    => await _dbContext.Payments.FirstOrDefaultAsync(p => p.Id == paymentId);
}
