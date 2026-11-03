using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Ambiente> Ambientes => Set<Ambiente>();
    public DbSet<Reserva> Reservas => Set<Reserva>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tabla Usuarios
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("Usuarios");
            entity.HasKey(e => e.Id_Usuario);
            entity.HasIndex(e => e.Usu_Correo).IsUnique();
        });

        // Tabla Ambientes
        modelBuilder.Entity<Ambiente>(entity =>
        {
            entity.ToTable("Ambientes");
            entity.HasKey(e => e.Id_Ambiente);
        });

        // Tabla Reservas
        modelBuilder.Entity<Reserva>(entity =>
        {
            entity.ToTable("Reservas");
            entity.HasKey(e => e.Id_Reserva);

            entity.HasOne(r => r.Usuario)
                  .WithMany(u => u.Reservas)
                  .HasForeignKey(r => r.Res_UsuarioId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Ambiente)
                  .WithMany(a => a.Reservas)
                  .HasForeignKey(r => r.Res_AmbienteId)
                  .OnDelete(DeleteBehavior.Restrict);

            // Índice para verificación rápida de disponibilidad horaria
            entity.HasIndex(r => new { r.Res_AmbienteId, r.Res_Fecha, r.Res_Estado });
        });

        // Seed Data Inicial para UPLA
        var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var docenteId = Guid.Parse("22222222-2222-2222-2222-222222222222");

        modelBuilder.Entity<Usuario>().HasData(
            new Usuario
            {
                Id_Usuario = adminId,
                Usu_NombreCompleto = "Administrador General UPLA",
                Usu_Correo = "admin@upla.edu.pe",
                Usu_Rol = "Administrador",
                Usu_Activo = true
            },
            new Usuario
            {
                Id_Usuario = docenteId,
                Usu_NombreCompleto = "Ing. Carlos Mendoza (Docente Sistemas)",
                Usu_Correo = "cmendoza@upla.edu.pe",
                Usu_Rol = "Solicitante",
                Usu_Activo = true
            }
        );

        var lab1Id = Guid.Parse("33333333-3333-3333-3333-333333333333");
        var audiId = Guid.Parse("44444444-4444-4444-4444-444444444444");
        var labRedesId = Guid.Parse("55555555-5555-5555-5555-555555555555");

        modelBuilder.Entity<Ambiente>().HasData(
            new Ambiente
            {
                Id_Ambiente = lab1Id,
                Amb_Nombre = "Laboratorio de Cómputo 01",
                Amb_Tipo = "Laboratorio",
                Amb_Capacidad = 35,
                Amb_Ubicacion = "Pabellón B - Piso 2",
                Amb_Estado = "Disponible"
            },
            new Ambiente
            {
                Id_Ambiente = audiId,
                Amb_Nombre = "Auditorio Central Los Andes",
                Amb_Tipo = "Auditorio",
                Amb_Capacidad = 250,
                Amb_Ubicacion = "Edificio Administrativo - Piso 1",
                Amb_Estado = "Disponible"
            },
            new Ambiente
            {
                Id_Ambiente = labRedesId,
                Amb_Nombre = "Laboratorio de Redes y Telecomunicaciones",
                Amb_Tipo = "Laboratorio",
                Amb_Capacidad = 28,
                Amb_Ubicacion = "Pabellón B - Piso 3",
                Amb_Estado = "Disponible"
            }
        );
    }
}
