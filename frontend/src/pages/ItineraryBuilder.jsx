import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Plus, Trash2, Tag, DollarSign, Activity, Star 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import api from '../services/api';
import { formatDate, formatCurrency } from '../utils/formatters';

export const ItineraryBuilder = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI State
  const [selectedStop, setSelectedStop] = useState(null);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Forms
  const [stopForm, setStopForm] = useState({ cityId: '', arrivalDate: '', departureDate: '' });
  const [activityForm, setActivityForm] = useState({ activityId: '', scheduledTime: '' }); // Using mocked activity list for dropdown
  
  // Hardcoded mock activities since backend doesn't have GET /activities
  const MOCK_ACTIVITIES = [
    { id: 1, name: 'Eiffel Tower Tour', category: 'Sightseeing', cost: 30 },
    { id: 2, name: 'Louvre Museum', category: 'Sightseeing', cost: 20 },
    { id: 4, name: 'Shibuya Crossing', category: 'Sightseeing', cost: 0 },
    { id: 5, name: 'Sushi Making Class', category: 'Food', cost: 80 },
    { id: 7, name: 'Ubud Monkey Forest', category: 'Adventure', cost: 5 },
    { id: 8, name: 'Mount Batur Sunrise Trek', category: 'Adventure', cost: 40 },
  ];

  useEffect(() => {
    fetchTripData();
    fetchCities();
  }, [id]);

  const fetchTripData = async () => {
    try {
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data);
      if (data.stops?.length > 0 && !selectedStop) {
        setSelectedStop(data.stops[0]);
      }
    } catch (error) {
      console.error('Failed to fetch trip details', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/cities');
      setCities(data);
      if (data.length > 0) {
        setStopForm(prev => ({ ...prev, cityId: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch cities', error);
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/trips/${id}/stops`, {
        cityId: parseInt(stopForm.cityId),
        arrivalDate: stopForm.arrivalDate,
        departureDate: stopForm.departureDate,
        stopOrder: (trip?.stops?.length || 0) + 1
      });
      setIsAddStopOpen(false);
      fetchTripData(); // Refresh to get new stop
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add stop');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!selectedStop) return;
    try {
      await api.post(`/stops/${selectedStop.id}/activities`, {
        activityId: parseInt(activityForm.activityId) || MOCK_ACTIVITIES[0].id,
        scheduledTime: activityForm.scheduledTime || null
      });
      setIsAddActivityOpen(false);
      fetchTripData(); // Refresh trip data to show new activity
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add activity. Note: ID might not match DB seed.');
    }
  };

  const handleAutoGenerate = async () => {
    if (!window.confirm("This will clear existing activities and generate a smart itinerary. Proceed?")) return;
    setIsGenerating(true);
    try {
      await api.post(`/trips/${id}/auto-generate`);
      await fetchTripData();
    } catch (error) {
      alert('Failed to auto-generate itinerary.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div></div>;
  }

  if (!trip) {
    return <div className="p-8 text-center text-gray-500">Trip not found.</div>;
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col -m-4 sm:-m-6 lg:-m-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/trips" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{trip.name}</h1>
            <p className="text-sm text-gray-500">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
          </div>
        </div>
        <Link to={`/budget/${trip.id}`}>
          <Button variant="secondary" className="flex items-center gap-2">
            <DollarSign size={16} /> Budget
          </Button>
        </Link>
      </div>

      {/* Two-Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Timeline */}
        <div className="w-1/3 min-w-[320px] max-w-sm bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Itinerary Stops</h2>
            <Button size="sm" onClick={() => setIsAddStopOpen(true)}>
              <Plus size={16} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {trip.stops?.length === 0 ? (
              <div className="text-center text-sm text-gray-500 mt-8">
                No stops added yet. Click + to add your first destination.
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-brand-200"></div>
                
                <div className="space-y-6">
                  {trip.stops?.map((stop, index) => (
                    <div 
                      key={stop.id}
                      onClick={() => setSelectedStop(stop)}
                      className={`relative pl-10 cursor-pointer group`}
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute left-[11px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                        selectedStop?.id === stop.id 
                          ? 'border-brand-500 bg-brand-500' 
                          : 'border-brand-300 bg-white group-hover:border-brand-400'
                      }`}></div>
                      
                      {/* Stop Card */}
                      <div className={`p-4 rounded-xl border transition-all ${
                        selectedStop?.id === stop.id 
                          ? 'bg-white border-brand-200 shadow-md ring-1 ring-brand-500' 
                          : 'bg-white border-gray-200 shadow-sm hover:border-brand-200'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900">{stop.city.name}</h3>
                          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                            Day {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 gap-1.5 mb-3">
                          <Calendar size={14} />
                          {formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}
                        </div>
                        <div className="flex -space-x-2">
                          {/* Tiny activity indicators */}
                          {stop.activities?.slice(0,3).map(a => (
                            <div key={a.id} className="w-6 h-6 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-700" title={a.activity.name}>
                              {a.activity.name.charAt(0)}
                            </div>
                          ))}
                          {stop.activities?.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-gray-600">
                              +{stop.activities.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Activities & Details */}
        <div className="flex-1 bg-white overflow-y-auto">
          {selectedStop ? (
            <div>
              {/* Selected Stop Header */}
              <div className="h-48 relative bg-gray-900">
                <img 
                  src={selectedStop.city.imageUrl ? (selectedStop.city.imageUrl.includes('?') ? selectedStop.city.imageUrl : `${selectedStop.city.imageUrl}?auto=format&fit=crop&w=1200&q=80`) : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'} 
                  alt={selectedStop.city.name} 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-gray-900/90 to-transparent">
                  <div className="flex items-center gap-2 text-brand-300 mb-2">
                    <MapPin size={18} />
                    <span className="font-medium tracking-wide uppercase">{selectedStop.city.country}</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white">{selectedStop.city.name}</h2>
                </div>
              </div>

              {/* Activities Content */}
              <div className="p-8 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="text-brand-500" /> Planned Activities
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={handleAutoGenerate} 
                      disabled={isGenerating}
                      className="flex items-center gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                    >
                      {isGenerating ? <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div> : <Star size={16} />}
                      Magic Generate
                    </Button>
                    <Button onClick={() => setIsAddActivityOpen(true)} className="flex items-center gap-2">
                      <Plus size={16} /> Add Custom
                    </Button>
                  </div>
                </div>

                {selectedStop.activities?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                    <p className="text-gray-500 mb-4">No activities planned for this stop yet.</p>
                    <Button variant="secondary" onClick={() => setIsAddActivityOpen(true)}>
                      Explore Things to Do
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedStop.activities?.map((item) => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">{item.activity.name}</h4>
                          <span className="bg-brand-50 text-brand-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {item.activity.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {item.activity.description || 'No description available for this activity.'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-gray-400" />
                            {item.activity.durationMins} mins
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Tag size={16} className="text-gray-400" />
                            {formatCurrency(item.activity.estimatedCost)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <MapPin size={64} className="mb-4 text-gray-200" />
              <p className="text-lg">Select a stop from the timeline to view details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Stop Modal */}
      <Modal isOpen={isAddStopOpen} onClose={() => setIsAddStopOpen(false)} title="Add Destination">
        <form onSubmit={handleAddStop} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select City</label>
            <select 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              value={stopForm.cityId}
              onChange={(e) => setStopForm({...stopForm, cityId: e.target.value})}
              required
            >
              <option value="" disabled>Choose a destination...</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Arrival Date"
              value={stopForm.arrivalDate}
              onChange={(e) => setStopForm({...stopForm, arrivalDate: e.target.value})}
              required
            />
            <Input
              type="date"
              label="Departure Date"
              value={stopForm.departureDate}
              onChange={(e) => setStopForm({...stopForm, departureDate: e.target.value})}
              required
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit">Add Stop</Button>
          </div>
        </form>
      </Modal>

      {/* Add Activity Modal (Mocked Explorer) */}
      <Modal isOpen={isAddActivityOpen} onClose={() => setIsAddActivityOpen(false)} title="Explore Activities">
        <form onSubmit={handleAddActivity} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select an Activity</label>
            <p className="text-xs text-gray-500 mb-3">Showing popular activities across all cities (Mocked explorer).</p>
            <select 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              value={activityForm.activityId}
              onChange={(e) => setActivityForm({...activityForm, activityId: e.target.value})}
              required
            >
              <option value="" disabled>Choose an activity...</option>
              {MOCK_ACTIVITIES.map(act => (
                <option key={act.id} value={act.id}>{act.name} - ${act.cost}</option>
              ))}
            </select>
          </div>
          <Input
            type="datetime-local"
            label="Scheduled Time (Optional)"
            value={activityForm.scheduledTime}
            onChange={(e) => setActivityForm({...activityForm, scheduledTime: e.target.value})}
          />
          <div className="pt-4 flex justify-end">
            <Button type="submit">Add to Itinerary</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ItineraryBuilder;
