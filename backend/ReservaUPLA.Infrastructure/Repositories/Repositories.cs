using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;
using ReservaUPLA.Infrastructure.Data;

namespace ReservaUPLA.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Usuario>> ObtenerTodosAsync() =>
        await _context.Usuarios.AsNoTracking().ToListAsync();

    public async Task<Usuario?> ObtenerPorIdAsync(Guid id) =>
        await _context.Usuarios.FindAsync(id);

    public async Task<Usuario?> ObtenerPorCorreoAsync(string correo) =>
        await _context.Usuarios.FirstOrDefaultAsync(u => u.Usu_Correo.ToLower() == correo.ToLower());

    public async Task AgregarAsync(Usuario usuario) =>
        await _context.Usuarios.AddAsync(usuario);

    public async Task GuardarCambiosAsync() =>
        await _context.SaveChangesAsync();
}

public class AmbienteRepository : IAmbienteRepository
{
    private readonly AppDbContext _context;

    public AmbienteRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ambiente>> ObtenerTodosAsync() =>
        await _context.Ambientes.AsNoTracking().ToListAsync();

    public async Task<Ambiente?> ObtenerPorIdAsync(Guid id) =>
        await _context.Ambientes.FindAsync(id);

    public async Task AgregarAsync(Ambiente ambiente) =>
        await _context.Ambientes.AddAsync(ambiente);

    public async Task GuardarCambiosAsync() =>
        await _context.SaveChangesAsync();
}

public class ReservaRepository : IReservaRepository
{
    private readonly AppDbContext _context;

    public ReservaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Reserva>> ObtenerTodasAsync() =>
        await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Ambiente)
            .AsNoTracking()
            .OrderByDescending(r => r.Res_Fecha)
            .ThenByDescending(r => r.Res_HoraInicio)
            .ToListAsync();

    public async Task<Reserva?> ObtenerPorIdAsync(Guid id) =>
        await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Ambiente)
            .FirstOrDefaultAsync(r => r.Id_Reserva == id);

    public async Task<bool> ExisteSolapamientoAsync(
        Guid ambienteId,
        DateOnly fecha,
        TimeOnly horaInicio,
        TimeOnly horaFin,
        Guid? reservaIgnorarId = null)
    {
        // RN-01: No solapamiento con reservas aprobadas
        var query = _context.Reservas
            .Where(r => r.Res_AmbienteId == ambienteId 
                     && r.Res_Fecha == fecha 
                     && r.Res_Estado == "Aprobada");

        if (reservaIgnorarId.HasValue)
        {
            query = query.Where(r => r.Id_Reserva != reservaIgnorarId.Value);
        }

        // Condición matemática de solapamiento: inicioA < finB && finA > inicioB
        return await query.AnyAsync(r => horaInicio < r.Res_HoraFin && horaFin > r.Res_HoraInicio);
    }

    public async Task AgregarAsync(Reserva reserva) =>
        await _context.Reservas.AddAsync(reserva);

    public async Task GuardarCambiosAsync() =>
        await _context.SaveChangesAsync();
}
