import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane } from 'lucide-react';

export const AuthLayout = () => {
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Graphic/Branding */}
      <div className="hidden lg:flex w-1/2 bg-brand-600 p-12 relative overflow-hidden flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white">
            <Plane size={32} className="stroke-[1.5]" />
            <span className="text-3xl font-bold tracking-tight">Traveloop</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Design your perfect journey with intelligent planning.
          </h1>
          <p className="text-brand-100 text-lg">
            Create multi-city itineraries, track budgets, and share your adventures seamlessly.
          </p>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 text-brand-600 mb-12">
            <Plane size={32} />
            <span className="text-3xl font-bold">Traveloop</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
