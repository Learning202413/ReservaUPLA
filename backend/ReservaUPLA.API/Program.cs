using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Application.Services;
using ReservaUPLA.Infrastructure.Data;
using ReservaUPLA.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ReservaUPLA API - Universidad Peruana Los Andes",
        Version = "v1",
        Description = "API REST Oficial para la Gestión de Reservas de Ambientes Universitarios (Semanas 01 a 09)"
    });
});

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Base de datos de alta disponibilidad (InMemory con persistencia en memoria durante la ejecución + Seed data inicial)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("ReservaUplaDb"));

// Inyección de Dependencias (Clean Architecture)
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAmbienteRepository, AmbienteRepository>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();

builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IAmbienteService, AmbienteService>();
builder.Services.AddScoped<IReservaService, ReservaService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

var app = builder.Build();

// Inicialización de la base de datos con seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ReservaUPLA API v1");
    c.RoutePrefix = "swagger"; // Swagger en http://localhost:5060/swagger
});

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// Redirección amigable de raíz a Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
