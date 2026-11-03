using System.ComponentModel.DataAnnotations;

namespace ReservaUPLA.Application.DTOs;

public class UsuarioDto
{
    public Guid Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public bool Activo { get; set; }
}

public class CrearUsuarioDto
{
    [Required(ErrorMessage = "El nombre completo es obligatorio")]
    [MinLength(3, ErrorMessage = "El nombre debe tener al menos 3 caracteres")]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo es obligatorio")]
    [EmailAddress(ErrorMessage = "El formato de correo no es válido")]
    public string Correo { get; set; } = string.Empty;

    [Required(ErrorMessage = "El rol es obligatorio")]
    public string Rol { get; set; } = "Solicitante";
}

public class AmbienteDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public int Capacidad { get; set; }
    public string Ubicacion { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
}

public class CrearAmbienteDto
{
    [Required(ErrorMessage = "El nombre del ambiente es obligatorio")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El tipo de ambiente es obligatorio")]
    public string Tipo { get; set; } = "Laboratorio";

    [Range(1, 1000, ErrorMessage = "La capacidad debe ser mayor a 0")]
    public int Capacidad { get; set; }

    [Required(ErrorMessage = "La ubicación es obligatoria")]
    public string Ubicacion { get; set; } = string.Empty;

    public string Estado { get; set; } = "Disponible";
}

public class ReservaDto
{
    public Guid Id { get; set; }
    public DateOnly Fecha { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFin { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public Guid UsuarioId { get; set; }
    public string SolicitanteNombre { get; set; } = string.Empty;
    public string SolicitanteCorreo { get; set; } = string.Empty;
    public Guid AmbienteId { get; set; }
    public string AmbienteNombre { get; set; } = string.Empty;
    public string AmbienteTipo { get; set; } = string.Empty;
    public string AmbienteUbicacion { get; set; } = string.Empty;
}

public class CrearReservaDto
{
    [Required(ErrorMessage = "La fecha es obligatoria")]
    public DateOnly Fecha { get; set; }

    [Required(ErrorMessage = "La hora de inicio es obligatoria")]
    public TimeOnly HoraInicio { get; set; }

    [Required(ErrorMessage = "La hora de fin es obligatoria")]
    public TimeOnly HoraFin { get; set; }

    [Required(ErrorMessage = "El motivo de la reserva es obligatorio")]
    [MinLength(10, ErrorMessage = "El motivo debe detallar al menos 10 caracteres")]
    public string Motivo { get; set; } = string.Empty;

    [Required(ErrorMessage = "El solicitante es obligatorio")]
    public Guid UsuarioId { get; set; }

    [Required(ErrorMessage = "El ambiente es obligatorio")]
    public Guid AmbienteId { get; set; }
}

public class CambiarEstadoReservaDto
{
    [Required(ErrorMessage = "El nuevo estado es obligatorio")]
    public string NuevoEstado { get; set; } = string.Empty; // Aprobada, Rechazada, Cancelada

    public string? MotivoRechazo { get; set; }
    public string RolEjecutor { get; set; } = "Administrador"; // Para validar RN-05
}

public class DashboardKpisDto
{
    public int TotalReservas { get; set; }
    public int ReservasPendientes { get; set; }
    public int ReservasAprobadas { get; set; }
    public int ReservasRechazadas { get; set; }
    public string AmbienteMasUtilizado { get; set; } = "Sin datos";
    public int UsosAmbienteMasUtilizado { get; set; }
}
