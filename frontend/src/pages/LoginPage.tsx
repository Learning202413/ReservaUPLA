import React, { useState, useRef, useEffect } from 'react';
import { Lock, Mail, AlertTriangle, Hand } from 'lucide-react';
import { InputField, Button, FormMessage } from '../components/ui';
import { LoginDemoProfiles } from '../components/usuarios/LoginDemoProfiles';
import { AuthLayout } from '../layouts/AuthLayout';
import { api } from '../services/api';
import { useHandedness } from '../hooks/useHandedness';
import { Usuario } from '../types';

interface LoginPageProps {
  onSuccess: (usuario: Usuario) => void;
  initialMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, initialMessage }) => {
  const [formData, setFormData] = useState({
    correo: 'admin@upla.edu.pe',
    contrasena: 'admin123',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>(initialMessage || '');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning' | ''>(
    initialMessage ? 'info' : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capsLockActivo, setCapsLockActivo] = useState(false);

  const correoRef = useRef<HTMLInputElement>(null);
  const { isLeftHanded, toggleHandedness } = useHandedness();

  useEffect(() => {
    correoRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (message) setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const capsLock = e.getModifierState('CapsLock');
    setCapsLockActivo(capsLock);
  };

  const handleSelectDemo = (correoDemo: string, passDemo: string) => {
    setFormData({
      correo: correoDemo,
      contrasena: passDemo,
    });
    setErrors({});
    setMessage('');
    correoRef.current?.focus();
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo institucional es obligatorio';
    } else if (!formData.correo.includes('@')) {
      newErrors.correo = 'El formato de correo no es válido';
    }

    if (!formData.contrasena.trim()) {
      newErrors.contrasena = 'La contraseña es obligatoria';
    } else if (formData.contrasena.length < 4) {
      newErrors.contrasena = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const usuario = await api.login(formData.correo.trim(), formData.contrasena.trim());
      onSuccess(usuario);
    } catch (err: any) {
      setMessage(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full text-left">
        {/* Cabecera del formulario */}
        <div className="mb-6">
          <span className="text-3xs font-extrabold uppercase tracking-widest text-primary bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
            Portal Institucional
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mt-2">
            Iniciar Sesión
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
            Ingrese sus credenciales oficiales para gestionar o solicitar ambientes.
          </p>
        </div>

        {/* Mensaje Contextual de Error / Notificación (FormMessage) */}
        {message && (
          <FormMessage
            type={messageType}
            message={message}
            className="mb-4"
          />
        )}

        {/* Alerta Accesible de Bloq Mayús (Heurística de Nielsen 5: Prevención de errores) */}
        {capsLockActivo && (
          <div
            role="alert"
            className="p-2.5 mb-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs flex items-center gap-2 font-medium"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Bloq Mayús está activado. Verifique su contraseña.</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          <InputField
            ref={correoRef}
            label="Correo Institucional UPLA"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            placeholder="ejemplo@upla.edu.pe"
            error={errors.correo}
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="username"
          />

          <InputField
            label="Contraseña"
            name="contrasena"
            isPassword
            value={formData.contrasena}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            error={errors.contrasena}
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="current-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isSubmitting={isSubmitting}
              submittingText="Validando credenciales..."
            >
              Ingresar al Sistema
            </Button>
          </div>
        </form>

        {/* Accesos Demo para Evaluación (LoginDemoProfiles) */}
        <LoginDemoProfiles onSelectDemo={handleSelectDemo} />

        {/* Barra inferior: Alternar Ergonomía Zurdos/Diestros (useHandedness de GirasolesRes) */}
        <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-2xs text-ink-muted">
          <button
            type="button"
            onClick={() => toggleHandedness()}
            className="flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer text-slate-500"
            title="Cambiar orientación para zurdos o diestros"
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Modo: {isLeftHanded ? 'Zurdo' : 'Diestro'}</span>
          </button>

          <span className="text-slate-400">ReservaUPLA v1.0</span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
