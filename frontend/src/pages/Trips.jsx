import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TripCard } from '../components/trips/TripCard';
import { CreateTripModal } from '../components/trips/CreateTripModal';
import { Button } from '../components/ui/Button';
import { Plus, Compass } from 'lucide-react';
import api from '../services/api';

export const Trips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await api.get('/trips');
      setTrips(data);
    } catch (error) {
      console.error('Failed to fetch trips', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTripCreated = (newTrip) => {
    setTrips(prev => [...prev, newTrip].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-500 mt-1">Manage and organize your travel itineraries.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} />
          Create New Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center text-brand-600 mb-4">
            <Compass size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No trips planned yet</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Start your next adventure by creating a new trip. You can add stops, activities, and track your budget.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Create Your First Trip</Button>
        </div>
      )}

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTripCreated={handleTripCreated}
      />
    </div>
  );
};

export default Trips;
