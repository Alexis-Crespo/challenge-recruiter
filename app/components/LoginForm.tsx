'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  loginSchema,
  type LoginFormData,
} from '../validations/validationSchemas';
import { loginUser } from '@/app/actions/login';
import { saveTokenToStorage } from '../helpers/jwt';
import PasswordInput from './PasswordInput';

type LoginFormProps = {
  onToggleAuth: () => void;
};

export default function LoginForm({ onToggleAuth }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser(data);

      if (!result.success) {
        setError(
          result.error ||
            'Error al iniciar sesión. Por favor, intenta nuevamente.'
        );
        return;
      }

      if (result.token) {
        saveTokenToStorage(result.token);
      }

      router.push('/home');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAuth = () => {
    reset();
    onToggleAuth();
  };

  return (
    <div className="w-full lg:w-[500px] relative order-2 lg:order-2">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 relative z-10 lg:mt-0">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
          Iniciar Sesión
        </h3>
        <p className="text-sm text-gray-600 mb-6 text-center">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={handleToggleAuth}
            className="text-[#fb6731] font-semibold hover:text-[#fb6731]/80 underline focus:outline-none focus:ring-2 focus:ring-[#fb6731] rounded"
          >
            Regístrate
          </button>
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form
          className="space-y-5 sm:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">
              Correo Electrónico*
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full border-b-2 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 outline-none py-2 transition-colors bg-transparent`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <PasswordInput
            register={register('password')}
            error={errors.password}
            label="Contraseña*"
            id="password"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-6 sm:mt-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
