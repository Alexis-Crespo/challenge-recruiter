'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  registerSchema,
  type RegisterFormData,
} from '../validations/validationSchemas';
import { registerUser } from '@/app/actions/register';
import PasswordInput from './PasswordInput';
import Stepper from './Stepper';

type RegisterFormProps = {
  onToggleAuth: () => void;
};

export default function RegisterForm({ onToggleAuth }: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    getValues,
    setError: setFieldError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const handleNextStep = async () => {
    // Obtener los valores actuales de los campos
    const formValues = getValues();
    const password = formValues.password;
    const repeatPassword = formValues.repeatPassword;
    
    if (password !== repeatPassword) {
      setFieldError('repeatPassword', {
        type: 'manual',
        message: 'Las contraseñas no coinciden',
      });
      return;
    }
    
    // Forzar la validación de todos los campos del paso 1
    const isValid = await trigger(['email', 'password', 'repeatPassword']);
    
    // Verificar si hay errores en estos campos
    const hasErrors = errors.email || errors.password || errors.repeatPassword;
    
    if (isValid && !hasErrors) {
      setCurrentStep(2);
      setError(null);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
    setError(null);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await registerUser(data);

      if (!result.success) {
        setError(
          'error' in result ? result.error : 'Error al registrar el usuario. Por favor, intenta nuevamente.'
        );
        return;
      }

      setSuccess(true);
      reset();

     
      setTimeout(() => {
        onToggleAuth();
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al registrar el usuario. Por favor, intenta nuevamente.');
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
          Registrarse
        </h3>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Si ya tienes cuenta{' '}
          <button
            type="button"
            onClick={handleToggleAuth}
            className="text-[#fb6731] font-semibold hover:text-[#fb6731]/80 underline focus:outline-none focus:ring-2 focus:ring-[#fb6731] rounded"
          >
            Inicia sesión
          </button>
        </p>

        <Stepper
          currentStep={currentStep}
          steps={[
            { number: 1, label: 'Credenciales' },
            { number: 2, label: 'Información Personal' },
          ]}
        />
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        )}
        <form
          className="space-y-5 sm:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {currentStep === 1 && (
            <>
            
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
              <PasswordInput
                register={register('repeatPassword')}
                error={errors.repeatPassword}
                label="Repetir Contraseña*"
                id="repeatPassword"
              />
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mt-6 sm:mt-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continuar
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Nombre*
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full border-b-2 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 outline-none py-2 transition-colors bg-transparent`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Apellido*
                </label>
                <input
                  type="text"
                  {...register('lastname')}
                  className={`w-full border-b-2 ${
                    errors.lastname ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 outline-none py-2 transition-colors bg-transparent`}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  DNI*
                </label>
                <input
                  type="text"
                  {...register('dni')}
                  className={`w-full border-b-2 ${
                    errors.dni ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 outline-none py-2 transition-colors bg-transparent`}
                  maxLength={10}
                />
                {errors.dni && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dni.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Fecha de Nacimiento*
                </label>
                <input
                  type="date"
                  {...register('dob')}
                  className={`w-full border-b-2 ${
                    errors.dob ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 outline-none py-2 transition-colors bg-transparent`}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dob.message}
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLoading ? 'Registrando...' : 'Crea tu cuenta'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
