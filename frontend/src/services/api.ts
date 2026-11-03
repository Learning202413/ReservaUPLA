import { Ambiente, CrearAmbienteInput, CrearReservaInput, CrearUsuarioInput, DashboardKpis, Reserva, Usuario } from '../types';

const API_BASE = '/api';

// Datos de respaldo iniciales para demo inmediata y offline-first
let localUsuarios: Usuario[] = [
  { id: '11111111-1111-1111-1111-111111111111', nombreCompleto: 'Administrador General UPLA', correo: 'admin@upla.edu.pe', rol: 'Administrador', activo: true },
  { id: '22222222-2222-2222-2222-222222222222', nombreCompleto: 'Ing. Carlos Mendoza (Docente Sistemas)', correo: 'cmendoza@upla.edu.pe', rol: 'Solicitante', activo: true },
  { id: '33333333-3333-3333-3333-333333333333', nombreCompleto: 'Dra. María Elena Quispe (Jefa Práctica)', correo: 'mquispe@upla.edu.pe', rol: 'Responsable', activo: true },
];

let localAmbientes: Ambiente[] = [
  { id: 'aaaa1111-1111-1111-1111-111111111111', nombre: 'Laboratorio de Cómputo 01', tipo: 'Laboratorio', capacidad: 35, ubicacion: 'Pabellón B - Piso 2', estado: 'Disponible' },
  { id: 'bbbb2222-2222-2222-2222-222222222222', nombre: 'Auditorio Central Los Andes', tipo: 'Auditorio', capacidad: 250, ubicacion: 'Edificio Central - Piso 1', estado: 'Disponible' },
  { id: 'cccc3333-3333-3333-3333-333333333333', nombre: 'Laboratorio de Redes y Telecomunicaciones', tipo: 'Laboratorio', capacidad: 28, ubicacion: 'Pabellón B - Piso 3', estado: 'Disponible' },
  { id: 'dddd4444-4444-4444-4444-444444444444', nombre: 'Sala de Grados y Sesiones', tipo: 'Sala', capacidad: 45, ubicacion: 'Facultad de Ingeniería - Piso 4', estado: 'Disponible' },
];

let localReservas: Reserva[] = [
  {
    id: 'res-001',
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '08:00',
    horaFin: '10:00',
    motivo: 'Clase magistral de Arquitectura de Software y Patrones de Diseño',
    estado: 'Aprobada',
    usuarioId: '22222222-2222-2222-2222-222222222222',
    solicitanteNombre: 'Ing. Carlos Mendoza (Docente Sistemas)',
    solicitanteCorreo: 'cmendoza@upla.edu.pe',
    ambienteId: 'aaaa1111-1111-1111-1111-111111111111',
    ambienteNombre: 'Laboratorio de Cómputo 01',
    ambienteTipo: 'Laboratorio',
    ambienteUbicacion: 'Pabellón B - Piso 2',
  },
  {
    id: 'res-002',
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '11:00',
    horaFin: '13:00',
    motivo: 'Sustentación de tesis de grado Escuela Profesional de Sistemas',
    estado: 'Pendiente',
    usuarioId: '22222222-2222-2222-2222-222222222222',
    solicitanteNombre: 'Ing. Carlos Mendoza (Docente Sistemas)',
    solicitanteCorreo: 'cmendoza@upla.edu.pe',
    ambienteId: 'bbbb2222-2222-2222-2222-222222222222',
    ambienteNombre: 'Auditorio Central Los Andes',
    ambienteTipo: 'Auditorio',
    ambienteUbicacion: 'Edificio Central - Piso 1',
  }
];

export const api = {
  async getKpis(): Promise<DashboardKpis> {
    try {
      const res = await fetch(`${API_BASE}/Dashboard/kpis`);
      if (res.ok) return await res.json();
    } catch {}

    const total = localReservas.length;
    const pendientes = localReservas.filter((r) => r.estado === 'Pendiente').length;
    const aprobadas = localReservas.filter((r) => r.estado === 'Aprobada').length;
    const rechazadas = localReservas.filter((r) => r.estado === 'Rechazada').length;
    
    // Calcular ambiente más usado
    const contador: Record<string, number> = {};
    localReservas.filter(r => r.estado === 'Aprobada').forEach(r => {
      contador[r.ambienteNombre] = (contador[r.ambienteNombre] || 0) + 1;
    });
    let masUsado = 'Sin datos';
    let max = 0;
    Object.entries(contador).forEach(([nombre, count]) => {
      if (count > max) {
        max = count;
        masUsado = nombre;
      }
    });

    return {
      totalReservas: total,
      reservasPendientes: pendientes,
      reservasAprobadas: aprobadas,
      reservasRechazadas: rechazadas,
      ambienteMasUtilizado: masUsado,
      usosAmbienteMasUtilizado: max,
    };
  },

  async getReservas(): Promise<Reserva[]> {
    try {
      const res = await fetch(`${API_BASE}/Reservas`);
      if (res.ok) return await res.json();
    } catch {}
    return [...localReservas];
  },

  async verificarDisponibilidad(ambienteId: string, fecha: string, horaInicio: string, horaFin: string): Promise<{ disponible: boolean; mensaje: string }> {
    try {
      const res = await fetch(`${API_BASE}/Reservas/verificar-disponibilidad?ambienteId=${ambienteId}&fecha=${fecha}&horaInicio=${horaInicio}&horaFin=${horaFin}`);
      const data = await res.json();
      return { disponible: res.ok && data.disponible, mensaje: data.mensaje || data.error };
    } catch {}

    // Validación algorítmica local (RN-01, RN-03, RN-04)
    if (horaFin <= horaInicio) {
      return { disponible: false, mensaje: 'RN-03: La hora de fin debe ser posterior a la de inicio.' };
    }
    if (horaInicio < '07:00' || horaFin > '22:00') {
      return { disponible: false, mensaje: 'RN-04: Las reservas solo operan entre las 07:00 y 22:00 horas.' };
    }

    const conflicto = localReservas.some(
      (r) => r.ambienteId === ambienteId && r.fecha === fecha && r.estado === 'Aprobada' && (horaInicio < r.horaFin && horaFin > r.horaInicio)
    );

    if (conflicto) {
      return { disponible: false, mensaje: 'RN-01: Conflicto. Ya existe una reserva aprobada para ese horario.' };
    }

    return { disponible: true, mensaje: 'Horario 100% disponible.' };
  },

  async crearReserva(input: CrearReservaInput): Promise<Reserva> {
    try {
      const res = await fetch(`${API_BASE}/Reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al registrar reserva');
      }
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
    }

    const usuario = localUsuarios.find((u) => u.id === input.usuarioId);
    const ambiente = localAmbientes.find((a) => a.id === input.ambienteId);

    const nueva: Reserva = {
      id: 'res-' + Math.random().toString(36).substring(2, 9),
      fecha: input.fecha,
      horaInicio: input.horaInicio,
      horaFin: input.horaFin,
      motivo: input.motivo,
      estado: 'Pendiente',
      usuarioId: input.usuarioId,
      solicitanteNombre: usuario?.nombreCompleto || 'Usuario',
      solicitanteCorreo: usuario?.correo || '',
      ambienteId: input.ambienteId,
      ambienteNombre: ambiente?.nombre || 'Ambiente',
      ambienteTipo: ambiente?.tipo || '',
      ambienteUbicacion: ambiente?.ubicacion || '',
    };

    localReservas.unshift(nueva);
    return nueva;
  },

  async cambiarEstadoReserva(id: string, nuevoEstado: string, rolEjecutor: string = 'Administrador'): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/Reservas/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado, rolEjecutor }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al cambiar estado');
      }
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
    }

    const r = localReservas.find((res) => res.id === id);
    if (!r) throw new Error('Reserva no encontrada');
    if (r.estado === 'Rechazada') throw new Error('RN-06: Una reserva rechazada no puede modificarse.');
    r.estado = nuevoEstado as any;
  },

  async getAmbientes(): Promise<Ambiente[]> {
    try {
      const res = await fetch(`${API_BASE}/Ambientes`);
      if (res.ok) return await res.json();
    } catch {}
    return [...localAmbientes];
  },

  async crearAmbiente(input: CrearAmbienteInput): Promise<Ambiente> {
    try {
      const res = await fetch(`${API_BASE}/Ambientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json();
    } catch {}

    const nuevo: Ambiente = {
      id: 'amb-' + Math.random().toString(36).substring(2, 9),
      ...input,
    };
    localAmbientes.push(nuevo);
    return nuevo;
  },

  async getUsuarios(): Promise<Usuario[]> {
    try {
      const res = await fetch(`${API_BASE}/Usuarios`);
      if (res.ok) return await res.json();
    } catch {}
    return [...localUsuarios];
  },

  async crearUsuario(input: CrearUsuarioInput): Promise<Usuario> {
    try {
      const res = await fetch(`${API_BASE}/Usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json();
    } catch {}

    const nuevo: Usuario = {
      id: 'usu-' + Math.random().toString(36).substring(2, 9),
      ...input,
      activo: true,
    };
    localUsuarios.push(nuevo);
    return nuevo;
  },

  async login(correo: string, clave: string): Promise<Usuario> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, clave }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          id: data.id,
          nombreCompleto: data.nombreCompleto,
          correo: data.correo,
          rol: data.rol,
          activo: true,
        };
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Credenciales inválidas.');
      }
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') throw e;
    }

    // Fallback local
    const u = localUsuarios.find((user) => user.correo.toLowerCase() === correo.trim().toLowerCase());
    if (!u) {
      throw new Error('Credenciales incorrectas: No existe usuario con este correo.');
    }
    return u;
  },
};
