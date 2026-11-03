using System.ComponentModel.DataAnnotations;

namespace ReservaUPLA.Domain.Entities;

public class Ambiente
{
    [Key]
    public Guid Id_Ambiente { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Amb_Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Amb_Tipo { get; set; } = "Laboratorio"; // Laboratorio, Auditorio, Sala, Taller

    [Range(1, 1000)]
    public int Amb_Capacidad { get; set; }

    [Required]
    [MaxLength(100)]
    public string Amb_Ubicacion { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Amb_Estado { get; set; } = "Disponible"; // Disponible, Mantenimiento

    // Navegación
    public ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}
