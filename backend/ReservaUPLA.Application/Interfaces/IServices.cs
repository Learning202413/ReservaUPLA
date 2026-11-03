using ReservaUPLA.Application.Common;
using ReservaUPLA.Application.DTOs;

namespace ReservaUPLA.Application.Interfaces;

public interface IUsuarioService
{
    Task<IEnumerable<UsuarioDto>> ListarUsuariosAsync();
    Task<Result<UsuarioDto>> RegistrarUsuarioAsync(CrearUsuarioDto dto);
}

public interface IAmbienteService
{
    Task<IEnumerable<AmbienteDto>> ListarAmbientesAsync();
    Task<Result<AmbienteDto>> RegistrarAmbienteAsync(CrearAmbienteDto dto);
}

public interface IReservaService
{
    Task<IEnumerable<ReservaDto>> ListarReservasAsync();
    Task<Result<ReservaDto>> ObtenerDetalleAsync(Guid id);
    Task<Result<bool>> ValidarDisponibilidadAsync(Guid ambienteId, DateOnly fecha, TimeOnly inicio, TimeOnly fin);
    Task<Result<Guid>> RegistrarReservaAsync(CrearReservaDto dto);
    Task<Result<bool>> CambiarEstadoAsync(Guid id, CambiarEstadoReservaDto dto);
}

public interface IDashboardService
{
    Task<DashboardKpisDto> ObtenerKpisAsync();
}
