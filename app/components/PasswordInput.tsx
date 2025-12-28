'use client';

import { useState } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import EyeIcon from './EyeIcon';

type PasswordInputProps = {
  register: UseFormRegisterReturn;
  error?: FieldError;
  label: string;
  id?: string;
};

export default function PasswordInput({
  register,
  error,
  label,
  id,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-0.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          {...register}
          className={`w-full border-b-2 ${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:border-blue-500 outline-none py-2 pr-10 transition-colors bg-transparent`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Toggle password visibility"
        >
          <EyeIcon isVisible={showPassword} />
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
