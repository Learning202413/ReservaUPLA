using ReservaUPLA.Application.Common;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Services;

public class ReservaService : IReservaService
{
    private readonly IReservaRepository _reservaRepository;
    private readonly IAmbienteRepository _ambienteRepository;
    private readonly IUsuarioRepository _usuarioRepository;

    private static readonly TimeOnly HORA_MINIMA = new(7, 0);
    private static readonly TimeOnly HORA_MAXIMA = new(22, 0);

    public ReservaService(
        IReservaRepository reservaRepository,
        IAmbienteRepository ambienteRepository,
        IUsuarioRepository usuarioRepository)
    {
        _reservaRepository = reservaRepository;
        _ambienteRepository = ambienteRepository;
        _usuarioRepository = usuarioRepository;
    }

    public async Task<IEnumerable<ReservaDto>> ListarReservasAsync()
    {
        var reservas = await _reservaRepository.ObtenerTodasAsync();
        return reservas.Select(r => new ReservaDto
        {
            Id = r.Id_Reserva,
            Fecha = r.Res_Fecha,
            HoraInicio = r.Res_HoraInicio,
            HoraFin = r.Res_HoraFin,
            Motivo = r.Res_Motivo,
            Estado = r.Res_Estado,
            UsuarioId = r.Res_UsuarioId,
            SolicitanteNombre = r.Usuario?.Usu_NombreCompleto ?? "Desconocido",
            SolicitanteCorreo = r.Usuario?.Usu_Correo ?? "",
            AmbienteId = r.Res_AmbienteId,
            AmbienteNombre = r.Ambiente?.Amb_Nombre ?? "Ambiente no especificado",
            AmbienteTipo = r.Ambiente?.Amb_Tipo ?? "",
            AmbienteUbicacion = r.Ambiente?.Amb_Ubicacion ?? "",
            MotivoRechazo = r.Res_MotivoRechazo
        });
    }

    public async Task<Result<ReservaDto>> ObtenerDetalleAsync(Guid id)
    {
        var r = await _reservaRepository.ObtenerPorIdAsync(id);
        if (r == null)
            return Result<ReservaDto>.Failure("No se encontró la reserva solicitada.");

        return Result<ReservaDto>.Success(new ReservaDto
        {
            Id = r.Id_Reserva,
            Fecha = r.Res_Fecha,
            HoraInicio = r.Res_HoraInicio,
            HoraFin = r.Res_HoraFin,
            Motivo = r.Res_Motivo,
            Estado = r.Res_Estado,
            UsuarioId = r.Res_UsuarioId,
            SolicitanteNombre = r.Usuario?.Usu_NombreCompleto ?? "",
            SolicitanteCorreo = r.Usuario?.Usu_Correo ?? "",
            AmbienteId = r.Res_AmbienteId,
            AmbienteNombre = r.Ambiente?.Amb_Nombre ?? "",
            AmbienteTipo = r.Ambiente?.Amb_Tipo ?? "",
            AmbienteUbicacion = r.Ambiente?.Amb_Ubicacion ?? "",
            MotivoRechazo = r.Res_MotivoRechazo
        });
    }

    public async Task<Result<bool>> ValidarDisponibilidadAsync(Guid ambienteId, DateOnly fecha, TimeOnly inicio, TimeOnly fin)
    {
        // RN-03: La hora de fin debe ser mayor que la hora de inicio
        if (fin <= inicio)
            return Result<bool>.Failure("RN-03: La hora de fin debe ser mayor a la hora de inicio.");

        // RN-04: Rango entre 07:00 y 22:00
        if (inicio < HORA_MINIMA || fin > HORA_MAXIMA)
            return Result<bool>.Failure("RN-04: Las reservas solo pueden programarse entre las 07:00 y 22:00 horas.");

        // RN-01: No solapamiento con reservas aprobadas
        bool conflicto = await _reservaRepository.ExisteSolapamientoAsync(ambienteId, fecha, inicio, fin);
        if (conflicto)
            return Result<bool>.Failure("RN-01: El ambiente ya cuenta con una reserva aprobada para ese horario.");

        return Result<bool>.Success(true);
    }

    public async Task<Result<Guid>> RegistrarReservaAsync(CrearReservaDto dto)
    {
        // RN-02: Validación de datos obligatorios
        if (string.IsNullOrWhiteSpace(dto.Motivo) || dto.Motivo.Trim().Length < 10)
            return Result<Guid>.Failure("RN-02: Toda reserva debe registrar un motivo detallado (mínimo 10 caracteres).");

        // RN-03: Hora fin > Hora inicio
        if (dto.HoraFin <= dto.HoraInicio)
            return Result<Guid>.Failure("RN-03: La hora de fin debe ser mayor que la hora de inicio.");

        // RN-04: Horario permitido entre 07:00 y 22:00
        if (dto.HoraInicio < HORA_MINIMA || dto.HoraFin > HORA_MAXIMA)
            return Result<Guid>.Failure("RN-04: Las reservas solo podrán realizarse entre las 07:00 y 22:00 horas.");

        // Verificar existencia de usuario y ambiente
        var ambiente = await _ambienteRepository.ObtenerPorIdAsync(dto.AmbienteId);
        if (ambiente == null)
            return Result<Guid>.Failure("El ambiente seleccionado no existe.");

        var usuario = await _usuarioRepository.ObtenerPorIdAsync(dto.UsuarioId);
        if (usuario == null)
            return Result<Guid>.Failure("El usuario solicitante no existe.");

        // RN-01 y RF-04: Validar disponibilidad antes de registrar
        bool solapado = await _reservaRepository.ExisteSolapamientoAsync(dto.AmbienteId, dto.Fecha, dto.HoraInicio, dto.HoraFin);
        if (solapado)
            return Result<Guid>.Failure("RN-01: Conflicto de horario. El ambiente ya está reservado y aprobado en ese rango.");

        var nuevaReserva = new Reserva
        {
            Id_Reserva = Guid.NewGuid(),
            Res_Fecha = dto.Fecha,
            Res_HoraInicio = dto.HoraInicio,
            Res_HoraFin = dto.HoraFin,
            Res_Motivo = dto.Motivo.Trim(),
            Res_Estado = "Pendiente",
            Res_UsuarioId = dto.UsuarioId,
            Res_AmbienteId = dto.AmbienteId
        };

        await _reservaRepository.AgregarAsync(nuevaReserva);
        await _reservaRepository.GuardarCambiosAsync();

        return Result<Guid>.Success(nuevaReserva.Id_Reserva);
    }

    public async Task<Result<bool>> CambiarEstadoAsync(Guid id, CambiarEstadoReservaDto dto)
    {
        var reserva = await _reservaRepository.ObtenerPorIdAsync(id);
        if (reserva == null)
            return Result<bool>.Failure("Reserva no encontrada.");

        // RN-06: Una reserva rechazada no podrá modificarse
        if (reserva.Res_Estado == "Rechazada")
            return Result<bool>.Failure("RN-06: Una reserva en estado 'Rechazada' no puede modificarse.");

        if (dto.NuevoEstado == "Cancelada")
        {
            if (reserva.Res_Estado != "Pendiente")
                return Result<bool>.Failure("Solo se pueden cancelar solicitudes en estado 'Pendiente'.");
        }
        else if ((dto.NuevoEstado == "Aprobada" || dto.NuevoEstado == "Rechazada") && dto.RolEjecutor != "Administrador")
        {
            return Result<bool>.Failure("RN-05: Solo el administrador tiene permisos para aprobar o rechazar reservas.");
        }

        // Si se aprueba, re-verificar que no haya entrado en conflicto
        if (dto.NuevoEstado == "Aprobada")
        {
            bool solapado = await _reservaRepository.ExisteSolapamientoAsync(
                reserva.Res_AmbienteId,
                reserva.Res_Fecha,
                reserva.Res_HoraInicio,
                reserva.Res_HoraFin,
                reserva.Id_Reserva);

            if (solapado)
                return Result<bool>.Failure("RN-01: No se puede aprobar la reserva porque generaría solapamiento con otra aprobada.");
        }

        reserva.Res_Estado = dto.NuevoEstado;
        if (!string.IsNullOrWhiteSpace(dto.MotivoRechazo))
        {
            reserva.Res_MotivoRechazo = dto.MotivoRechazo.Trim();
        }

        await _reservaRepository.GuardarCambiosAsync();

        return Result<bool>.Success(true);
    }
}
