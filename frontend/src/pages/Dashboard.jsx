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
    <div className="glass p-6 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center gap-4 group">
      <div className={`p-4 rounded-xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-500 to-brand-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-brand-50 max-w-xl text-lg font-medium drop-shadow-sm">
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
          <div className="glass rounded-3xl p-12 text-center border-dashed border-2 border-brand-200">
            <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map size={32} className="text-brand-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No trips planned yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Your itinerary is a blank canvas. Start dreaming and build your first unforgettable journey.</p>
            <Link to="/trips" className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              Create a Trip <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
