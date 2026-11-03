using System.ComponentModel.DataAnnotations;

namespace ReservaUPLA.Domain.Entities;

public class Usuario
{
    [Key]
    public Guid Id_Usuario { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(150)]
    public string Usu_NombreCompleto { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Usu_Correo { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Usu_Rol { get; set; } = "Solicitante"; // Solicitante, Administrador, Responsable

    public bool Usu_Activo { get; set; } = true;

    // Navegación
    public ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}
