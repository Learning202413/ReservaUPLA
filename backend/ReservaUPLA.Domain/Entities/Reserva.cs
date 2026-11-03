using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReservaUPLA.Domain.Entities;

public class Reserva
{
    [Key]
    public Guid Id_Reserva { get; set; } = Guid.NewGuid();

    [Required]
    public DateOnly Res_Fecha { get; set; }

    [Required]
    public TimeOnly Res_HoraInicio { get; set; }

    [Required]
    public TimeOnly Res_HoraFin { get; set; }

    [Required]
    public string Res_Motivo { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Res_Estado { get; set; } = "Pendiente"; // Pendiente, Aprobada, Rechazada, Cancelada

    public string? Res_MotivoRechazo { get; set; }

    [Required]
    public Guid Res_UsuarioId { get; set; }

    [ForeignKey(nameof(Res_UsuarioId))]
    public Usuario? Usuario { get; set; }

    [Required]
    public Guid Res_AmbienteId { get; set; }

    [ForeignKey(nameof(Res_AmbienteId))]
    public Ambiente? Ambiente { get; set; }
}
