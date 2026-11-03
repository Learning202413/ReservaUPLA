using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<IEnumerable<Usuario>> ObtenerTodosAsync();
    Task<Usuario?> ObtenerPorIdAsync(Guid id);
    Task<Usuario?> ObtenerPorCorreoAsync(string correo);
    Task AgregarAsync(Usuario usuario);
    Task GuardarCambiosAsync();
}

public interface IAmbienteRepository
{
    Task<IEnumerable<Ambiente>> ObtenerTodosAsync();
    Task<Ambiente?> ObtenerPorIdAsync(Guid id);
    Task AgregarAsync(Ambiente ambiente);
    Task GuardarCambiosAsync();
}

public interface IReservaRepository
{
    Task<IEnumerable<Reserva>> ObtenerTodasAsync();
    Task<Reserva?> ObtenerPorIdAsync(Guid id);
    Task<bool> ExisteSolapamientoAsync(Guid ambienteId, DateOnly fecha, TimeOnly horaInicio, TimeOnly horaFin, Guid? reservaIgnorarId = null);
    Task AgregarAsync(Reserva reserva);
    Task GuardarCambiosAsync();
}
