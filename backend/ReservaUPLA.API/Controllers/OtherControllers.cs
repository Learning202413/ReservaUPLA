using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AmbientesController : ControllerBase
{
    private readonly IAmbienteService _ambienteService;

    public AmbientesController(IAmbienteService ambienteService)
    {
        _ambienteService = ambienteService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var ambientes = await _ambienteService.ListarAmbientesAsync();
        return Ok(ambientes);
    }

    [HttpPost]
    public async Task<IActionResult> Registrar([FromBody] CrearAmbienteDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _ambienteService.RegistrarAmbienteAsync(dto);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.Error });

        return Created("", result.Value);
    }
}

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var usuarios = await _usuarioService.ListarUsuariosAsync();
        return Ok(usuarios);
    }

    [HttpPost]
    public async Task<IActionResult> Registrar([FromBody] CrearUsuarioDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _usuarioService.RegistrarUsuarioAsync(dto);
        if (!result.IsSuccess)
            return BadRequest(new { error = result.Error });

        return Created("", result.Value);
    }
}

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("kpis")]
    public async Task<IActionResult> ObtenerKpis()
    {
        var kpis = await _dashboardService.ObtenerKpisAsync();
        return Ok(kpis);
    }
}
