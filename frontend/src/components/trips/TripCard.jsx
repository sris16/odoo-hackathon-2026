import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const TripCard = ({ trip }) => {
  const isPast = new Date(trip.endDate) < new Date();
  
  return (
    <Link 
      to={`/trips/${trip.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {trip.coverPhoto ? (
          <img 
            src={trip.coverPhoto} 
            alt={trip.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <MapPin size={48} className="text-white/50" />
          </div>
        )}
        {isPast && (
          <div className="absolute top-4 right-4 bg-gray-900/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            Past Trip
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
          {trip.name}
        </h3>
        
        {trip.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {trip.description}
          </p>
        )}

        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Calendar size={16} className="text-gray-400" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          {trip.isPublic && (
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <Users size={16} className="text-gray-400" />
              <span>Publicly Shared</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
