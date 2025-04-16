using System.Text.Json;
using System.Text.Json.Serialization;
using Aquadata.Api.Configs;
using Aquadata.Infra.Payments.MercadoPago.Jobs;
using Hangfire;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAppConnections(builder.Configuration);
builder.Services.AddControllers().AddJsonOptions(o => {
    o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.InjectDependencies();
// builder.Services.AddJWT(builder.Configuration);
builder.Services.AddBasicAuth();

builder.Services.AddJobs(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHangfireDashboard();
app.UseHttpsRedirection();
app.UseCors(x => {
    x.AllowAnyHeader();
    x.AllowAnyMethod();
    x.AllowAnyOrigin();
});
app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();

RecurringJob.AddOrUpdate<RenewSubscriptionsJob>(
    "RenewSubscriptionsJob",
    job => job.Execute(),
    Cron.Minutely()
);
app.Run();

public partial class Program { }