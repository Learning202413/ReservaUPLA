using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Application.Services;
using ReservaUPLA.Infrastructure.Data;
using ReservaUPLA.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configuración de Controladores y Swagger con Documentación OpenAPI
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ReservaUPLA API - Sistema de Gestión de Reservas",
        Version = "v1",
        Description = "API REST Oficial para la Universidad Peruana Los Andes (UPLA) - Construcción de Software"
    });
});

// Configuración de CORS para el Frontend (Vite)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Base de datos: Configuración de Base de Datos Híbrida (PostgreSQL con Fallback automático a InMemory)
var postgresConnection = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=5432;Database=reservaupla_db;Username=postgres;Password=postgres";

bool usePostgres = false;
try
{
    // Verificamos si PostgreSQL está configurado y accesible
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(postgresConnection));
    usePostgres = true;
}
catch
{
    usePostgres = false;
}

if (!usePostgres)
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("ReservaUplaInMemoryDb"));
}

// Inyección de Dependencias (Clean Architecture)
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAmbienteRepository, AmbienteRepository>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();

builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IAmbienteService, AmbienteService>();
builder.Services.AddScoped<IReservaService, ReservaService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

var app = builder.Build();

// Inicialización de la base de datos (EnsureCreated para crear tablas y seed data)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[AVISO] No se pudo conectar a PostgreSQL ({ex.Message}). Usando memoria.");
    }
}

// Middlewares
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ReservaUPLA API v1");
    c.RoutePrefix = string.Empty; // Swagger en la raíz http://localhost:5060/
});

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
