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
        var responsableId = Guid.Parse("88888888-8888-8888-8888-888888888888");

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
            },
            new Usuario
            {
                Id_Usuario = responsableId,
                Usu_NombreCompleto = "Dra. María Elena Quispe (Jefa Práctica)",
                Usu_Correo = "mquispe@upla.edu.pe",
                Usu_Rol = "Responsable",
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

        var res1Id = Guid.Parse("66666666-6666-6666-6666-666666666666");
        var res2Id = Guid.Parse("77777777-7777-7777-7777-777777777777");

        modelBuilder.Entity<Reserva>().HasData(
            new Reserva
            {
                Id_Reserva = res1Id,
                Res_Fecha = DateOnly.FromDateTime(DateTime.Today),
                Res_HoraInicio = new TimeOnly(8, 0),
                Res_HoraFin = new TimeOnly(10, 0),
                Res_Motivo = "Clase magistral de Arquitectura de Software y Patrones de Diseño [Aforo estimado: 25 pers.]",
                Res_Estado = "Aprobada",
                Res_UsuarioId = docenteId,
                Res_AmbienteId = lab1Id
            },
            new Reserva
            {
                Id_Reserva = res2Id,
                Res_Fecha = DateOnly.FromDateTime(DateTime.Today),
                Res_HoraInicio = new TimeOnly(11, 0),
                Res_HoraFin = new TimeOnly(13, 0),
                Res_Motivo = "Sustentación de tesis de grado Escuela Profesional de Sistemas [Aforo estimado: 40 pers.]",
                Res_Estado = "Pendiente",
                Res_UsuarioId = docenteId,
                Res_AmbienteId = audiId
            }
        );
    }
}
