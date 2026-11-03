using ReservaUPLA.Application.Common;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;

    public UsuarioService(IUsuarioRepository usuarioRepository)
    {
        _usuarioRepository = usuarioRepository;
    }

    public async Task<IEnumerable<UsuarioDto>> ListarUsuariosAsync()
    {
        var usuarios = await _usuarioRepository.ObtenerTodosAsync();
        return usuarios.Select(u => new UsuarioDto
        {
            Id = u.Id_Usuario,
            NombreCompleto = u.Usu_NombreCompleto,
            Correo = u.Usu_Correo,
            Rol = u.Usu_Rol,
            Activo = u.Usu_Activo
        });
    }

    public async Task<Result<UsuarioDto>> RegistrarUsuarioAsync(CrearUsuarioDto dto)
    {
        var existente = await _usuarioRepository.ObtenerPorCorreoAsync(dto.Correo.Trim().ToLower());
        if (existente != null)
            return Result<UsuarioDto>.Failure("El correo ya se encuentra registrado en el sistema.");

        var nuevo = new Usuario
        {
            Id_Usuario = Guid.NewGuid(),
            Usu_NombreCompleto = dto.NombreCompleto.Trim(),
            Usu_Correo = dto.Correo.Trim().ToLower(),
            Usu_Rol = dto.Rol,
            Usu_Activo = true
        };

        await _usuarioRepository.AgregarAsync(nuevo);
        await _usuarioRepository.GuardarCambiosAsync();

        return Result<UsuarioDto>.Success(new UsuarioDto
        {
            Id = nuevo.Id_Usuario,
            NombreCompleto = nuevo.Usu_NombreCompleto,
            Correo = nuevo.Usu_Correo,
            Rol = nuevo.Usu_Rol,
            Activo = nuevo.Usu_Activo
        });
    }

    public async Task<Result<LoginResponseDto>> IniciarSesionAsync(LoginDto dto)
    {
        var usuario = await _usuarioRepository.ObtenerPorCorreoAsync(dto.Correo.Trim().ToLower());
        if (usuario == null)
            return Result<LoginResponseDto>.Failure("Credenciales incorrectas: No existe un usuario con este correo institucional.");

        if (!usuario.Usu_Activo)
            return Result<LoginResponseDto>.Failure("Usuario inactivo. Comuníquese con la administración del campus UPLA.");

        // Para entorno académico permitimos cualquier contraseña válida mínima de 4 caracteres
        if (string.IsNullOrWhiteSpace(dto.Clave) || dto.Clave.Length < 4)
            return Result<LoginResponseDto>.Failure("La contraseña ingresada no es válida (mínimo 4 caracteres).");

        return Result<LoginResponseDto>.Success(new LoginResponseDto
        {
            Id = usuario.Id_Usuario,
            NombreCompleto = usuario.Usu_NombreCompleto,
            Correo = usuario.Usu_Correo,
            Rol = usuario.Usu_Rol,
            Token = $"upla-session-token-{usuario.Id_Usuario}-{DateTime.UtcNow.Ticks}"
        });
    }
}

public class AmbienteService : IAmbienteService
{
    private readonly IAmbienteRepository _ambienteRepository;

    public AmbienteService(IAmbienteRepository ambienteRepository)
    {
        _ambienteRepository = ambienteRepository;
    }

    public async Task<IEnumerable<AmbienteDto>> ListarAmbientesAsync()
    {
        var ambientes = await _ambienteRepository.ObtenerTodosAsync();
        return ambientes.Select(a => new AmbienteDto
        {
            Id = a.Id_Ambiente,
            Nombre = a.Amb_Nombre,
            Tipo = a.Amb_Tipo,
            Capacidad = a.Amb_Capacidad,
            Ubicacion = a.Amb_Ubicacion,
            Estado = a.Amb_Estado
        });
    }

    public async Task<Result<AmbienteDto>> RegistrarAmbienteAsync(CrearAmbienteDto dto)
    {
        if (dto.Capacidad <= 0)
            return Result<AmbienteDto>.Failure("La capacidad del ambiente debe ser mayor a 0.");

        var nuevo = new Ambiente
        {
            Id_Ambiente = Guid.NewGuid(),
            Amb_Nombre = dto.Nombre.Trim(),
            Amb_Tipo = dto.Tipo,
            Amb_Capacidad = dto.Capacidad,
            Amb_Ubicacion = dto.Ubicacion.Trim(),
            Amb_Estado = dto.Estado
        };

        await _ambienteRepository.AgregarAsync(nuevo);
        await _ambienteRepository.GuardarCambiosAsync();

        return Result<AmbienteDto>.Success(new AmbienteDto
        {
            Id = nuevo.Id_Ambiente,
            Nombre = nuevo.Amb_Nombre,
            Tipo = nuevo.Amb_Tipo,
            Capacidad = nuevo.Amb_Capacidad,
            Ubicacion = nuevo.Amb_Ubicacion,
            Estado = nuevo.Amb_Estado
        });
    }
}

public class DashboardService : IDashboardService
{
    private readonly IReservaRepository _reservaRepository;

    public DashboardService(IReservaRepository reservaRepository)
    {
        _reservaRepository = reservaRepository;
    }

    public async Task<DashboardKpisDto> ObtenerKpisAsync()
    {
        var reservas = (await _reservaRepository.ObtenerTodasAsync()).ToList();

        var total = reservas.Count;
        var pendientes = reservas.Count(r => r.Res_Estado == "Pendiente");
        var aprobadas = reservas.Count(r => r.Res_Estado == "Aprobada");
        var rechazadas = reservas.Count(r => r.Res_Estado == "Rechazada");

        // Ambiente más utilizado
        var ambienteGrupo = reservas
            .Where(r => r.Res_Estado == "Aprobada" && r.Ambiente != null)
            .GroupBy(r => r.Ambiente!.Amb_Nombre)
            .OrderByDescending(g => g.Count())
            .FirstOrDefault();

        string masUsado = ambienteGrupo?.Key ?? "Ninguno aún";
        int cantidadUsos = ambienteGrupo?.Count() ?? 0;

        return new DashboardKpisDto
        {
            TotalReservas = total,
            ReservasPendientes = pendientes,
            ReservasAprobadas = aprobadas,
            ReservasRechazadas = rechazadas,
            AmbienteMasUtilizado = masUsado,
            UsosAmbienteMasUtilizado = cantidadUsos
        };
    }
}
