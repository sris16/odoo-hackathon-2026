import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Map, MapPin, Calendar, CreditCard, ArrowRight } from 'lucide-react';
import { TripCard } from '../components/trips/TripCard';
import api from '../services/api';

export const Dashboard = () => {
  const { user } = useAuth();
  const [recentTrips, setRecentTrips] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, upcomingTrips: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/trips');
        const upcoming = data.filter(t => new Date(t.startDate) >= new Date());
        
        setStats({
          totalTrips: data.length,
          upcomingTrips: upcoming.length
        });
        
        // Show up to 3 upcoming or most recent trips
        setRecentTrips(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl p-8 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-brand-100 max-w-xl text-lg">
            Ready for your next adventure? Let's plan something extraordinary today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={Map} 
          title="Total Trips" 
          value={isLoading ? '-' : stats.totalTrips} 
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          icon={Calendar} 
          title="Upcoming Trips" 
          value={isLoading ? '-' : stats.upcomingTrips} 
          colorClass="bg-brand-50 text-brand-600"
        />
        <StatCard 
          icon={MapPin} 
          title="Cities Explored" 
          value={isLoading ? '-' : (stats.totalTrips * 2)} // Mock data for now until we sum stops
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Recent Trips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Trips</h2>
          <Link to="/trips" className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : recentTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't planned any trips yet.</p>
            <Link to="/trips" className="inline-block bg-brand-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-brand-600 transition-colors">
              Create a Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
