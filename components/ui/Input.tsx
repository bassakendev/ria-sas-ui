import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors ${
            error ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1.5">{error}</p>}
        {helperText && !error && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
