using Aquadata.Api.Extensions;
using Aquadata.Api.Response;
using Aquadata.Application.Dtos;
using Aquadata.Application.Interfaces;
using Aquadata.Application.UseCases.Financial.AddEmployeePayment;
using Aquadata.Application.UseCases.Financial.AddFeedPurchase;
using Aquadata.Application.UseCases.Financial.AddPLPurchase;
using Aquadata.Application.UseCases.Financial.Common;
using Aquadata.Application.UseCases.Financial.GetFinancial;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Aquadata.Api.Controllers;

[ApiController]
[Route("/financial")]
[Authorize]
public class FinancialController:ControllerBase
{
  private readonly IMediator _mediator;

  public FinancialController(IMediator mediator)
    => _mediator = mediator;

  private async Task<IResult> SendRequest<TRequest>(TRequest command, 
  CancellationToken cancellationToken)
  where TRequest: IUseCaseRequest<Unit>
  {
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Created();
  }

  [HttpGet]
  public async Task<IResult> GetFinancial(CancellationToken cancellationToken)
  {
    var command = new GetFinancialInput();
    var result = await _mediator.Send(command, cancellationToken);

    if (result.IsFail)
      return Results.Extensions.MapResult(result);

    return Results.Ok(
      new ApiResponse<FinancialOutput>(result.Unwrap())
    );
  }

  [HttpPost("add-feed-purchase")]
  public async Task<IResult> AddFeedPurchase(
    [FromBody] AddFeedPurchaseInput command,
    CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);
  
  [HttpPost("add-probiotic-purchase")]
  public async Task<IResult> AddProbioticPurchase(
    [FromBody] ProbioticPurchaseDto command,
    CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-fertilizer-purchase")]
  public async Task<IResult> AddFertilizerPurchase(
    [FromBody] FertilizerPurchaseDto command,
    CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-post-larvae-purchase")]
  public async Task<IResult> AddPLPurchase(
    [FromBody] AddPLPurchaseInput command,
    CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-generic-purchase")]
  public async Task<IResult> AddGenericPurchase(
    [FromBody] GenericPurchaseDto command,
    CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-expense")]
  public async Task<IResult> AddGenericPurchase(
    [FromBody] ExpenseDto command,
    CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-employee")]
  public async Task<IResult> AddEmployee(
    [FromBody] EmployeeDto command,
    CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);

  [HttpPost("add-employee-payment")]
  public async Task<IResult> AddEmployeePayment(
    [FromBody] AddEmployeePaymentInput command,
    CancellationToken cancellationToken)
    => await SendRequest(command,cancellationToken);
}
