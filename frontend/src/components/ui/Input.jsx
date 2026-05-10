import React, { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all duration-200
          ${error 
            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 text-red-900 placeholder-red-300' 
            : 'border-gray-200 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 placeholder-gray-400'
          }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
