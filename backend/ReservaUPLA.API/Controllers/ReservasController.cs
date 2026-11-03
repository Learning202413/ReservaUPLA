using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservasController : ControllerBase
{
    private readonly IReservaService _reservaService;

    public ReservasController(IReservaService reservaService)
    {
        _reservaService = reservaService;
    }

    // RF-05: Listar reservas registradas
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var reservas = await _reservaService.ListarReservasAsync();
        return Ok(reservas);
    }

    // RF-06: Consultar detalle de una reserva
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> ObtenerDetalle(Guid id)
    {
        var result = await _reservaService.ObtenerDetalleAsync(id);
        if (!result.IsSuccess)
            return NotFound(new { error = result.Error });

        return Ok(result.Value);
    }

    // RF-04: Validar disponibilidad antes de registrar
    [HttpGet("verificar-disponibilidad")]
    public async Task<IActionResult> VerificarDisponibilidad(
        [FromQuery] Guid ambienteId,
        [FromQuery] DateOnly fecha,
        [FromQuery] TimeOnly horaInicio,
        [FromQuery] TimeOnly horaFin)
    {
        var result = await _reservaService.ValidarDisponibilidadAsync(ambienteId, fecha, horaInicio, horaFin);
        if (!result.IsSuccess)
            return BadRequest(new { disponible = false, mensaje = result.Error });

        return Ok(new { disponible = true, mensaje = "Horario disponible para reserva." });
    }

    // RF-03: Registrar solicitudes de reserva (con RN-01 a RN-04)
    [HttpPost]
    public async Task<IActionResult> Registrar([FromBody] CrearReservaDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _reservaService.RegistrarReservaAsync(dto);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(nameof(ObtenerDetalle), new { id = result.Value }, new { id = result.Value, mensaje = "Reserva registrada correctamente en estado 'Pendiente'." });
    }

    // RF-07: Cambiar estado (Pendiente, Aprobada, Rechazada, Cancelada con RN-05 y RN-06)
    [HttpPut("{id:guid}/estado")]
    public async Task<IActionResult> CambiarEstado(Guid id, [FromBody] CambiarEstadoReservaDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _reservaService.CambiarEstadoAsync(id, dto);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.Error });

        return Ok(new { mensaje = $"Estado de la reserva actualizado a '{dto.NuevoEstado}' con éxito." });
    }
}
