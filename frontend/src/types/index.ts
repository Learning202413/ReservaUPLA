export interface Usuario {
  id: string;
  nombreCompleto: string;
  correo: string;
  rol: 'Solicitante' | 'Administrador' | 'Responsable';
  activo: boolean;
}

export interface CrearUsuarioInput {
  nombreCompleto: string;
  correo: string;
  rol: 'Solicitante' | 'Administrador' | 'Responsable';
}

export interface Ambiente {
  id: string;
  nombre: string;
  tipo: 'Laboratorio' | 'Auditorio' | 'Sala' | 'Taller';
  capacidad: number;
  ubicacion: string;
  estado: 'Disponible' | 'Mantenimiento';
}

export interface CrearAmbienteInput {
  nombre: string;
  tipo: 'Laboratorio' | 'Auditorio' | 'Sala' | 'Taller';
  capacidad: number;
  ubicacion: string;
  estado: 'Disponible' | 'Mantenimiento';
}

export interface Reserva {
  id: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  motivo: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Cancelada';
  usuarioId: string;
  solicitanteNombre: string;
  solicitanteCorreo: string;
  ambienteId: string;
  ambienteNombre: string;
  ambienteTipo: string;
  ambienteUbicacion: string;
  motivoRechazo?: string;
}

export interface CrearReservaInput {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  usuarioId: string;
  ambienteId: string;
}

export interface DashboardKpis {
  totalReservas: number;
  reservasPendientes: number;
  reservasAprobadas: number;
  reservasRechazadas: number;
  ambienteMasUtilizado: string;
  usosAmbienteMasUtilizado: number;
}
