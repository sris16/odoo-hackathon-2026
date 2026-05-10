import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, TrendingUp, Wallet, X, Calendar, Plus } from 'lucide-react';
import api from '../services/api';

export const Explore = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [budget, setBudget] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityActivities, setCityActivities] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      try {
        const [trendingRes, budgetRes] = await Promise.all([
          api.get('/cities/trending'),
          api.get('/cities/budget')
        ]);
        setTrending(trendingRes.data);
        setBudget(budgetRes.data);
      } catch (error) {
        console.error('Failed to fetch discovery data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiscoveryData();
  }, []);

  const openCityModal = async (city) => {
    setSelectedCity(city);
    setCityActivities([]);
    try {
      const res = await api.get(`/cities/${city.id}/activities`);
      setCityActivities(res.data);
    } catch (err) {
      console.error('Failed to fetch city activities', err);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    setIsCreating(true);
    try {
      // 1. Create Trip
      const tripRes = await api.post('/trips', {
        name: `Trip to ${selectedCity.name}`,
        startDate,
        endDate,
        coverPhoto: selectedCity.imageUrl
      });
      // 2. Add Stop
      await api.post(`/trips/${tripRes.data.id}/stops`, {
        cityId: selectedCity.id,
        arrivalDate: startDate,
        departureDate: endDate
      });
      // 3. Navigate to builder
      navigate(`/trips/${tripRes.data.id}`);
    } catch (err) {
      console.error('Failed to create trip', err);
      setIsCreating(false);
    }
  };

  const CityCard = ({ city }) => (
    <div 
      onClick={() => openCityModal(city)}
      className="group cursor-pointer min-w-[300px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 snap-start"
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={city.imageUrl || 'https://loremflickr.com/800/600/city'} 
          alt={city.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          {city.popularity}/5
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{city.name}</h3>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin size={16} />
          {city.country}
        </div>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">Cost Index</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <span key={i} className={`text-sm ${i <= city.costIndex ? 'text-gray-900 font-bold' : 'text-gray-300'}`}>$</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-12 animate-fade-in-up">
      {/* Hero Header */}
      <div className="flex flex-col justify-center items-start gap-4 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-blob"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">Discover Your Next Adventure</h1>
          <p className="text-brand-50 text-lg font-medium drop-shadow-sm">Explore curated lists of global destinations based on what's trending and what fits your budget.</p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-slow">
            <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98.1,-18,97.7,-2.6C97.3,12.8,89.9,28.1,80.1,41.4C70.3,54.7,58.2,66.1,44.4,74.2C30.6,82.3,15.3,87.1,-0.1,87.2C-15.5,87.3,-31,82.7,-44.5,74.4C-58,66.1,-69.5,54.1,-78.4,40.1C-87.3,26.1,-93.6,10.1,-94.1,-6.1C-94.6,-22.3,-89.3,-38.7,-79.8,-52.1C-70.3,-65.5,-56.6,-75.9,-41.8,-82.7C-27,-89.5,-13.5,-92.7,0.7,-93.7C14.9,-94.7,29.8,-93.5,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-20"><div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div></div>
      ) : (
        <>
          {/* Trending Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Trending Destinations</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-6 snap-x hide-scrollbar">
              {trending.map(city => <CityCard key={city.id} city={city} />)}
            </div>
          </section>

          {/* Budget Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                <Wallet size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Budget Friendly</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-6 snap-x hide-scrollbar">
              {budget.map(city => <CityCard key={city.id} city={city} />)}
            </div>
          </section>
        </>
      )}

      {/* City Details Modal */}
      {selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row border border-white/20">
            
            {/* Left Side: Image & City Info */}
            <div className="w-full md:w-1/2 relative bg-gray-100">
              <img 
                src={selectedCity.imageUrl || 'https://loremflickr.com/800/600/city'} 
                alt={selectedCity.name} 
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-8 text-white">
                <h2 className="text-4xl font-bold mb-2">{selectedCity.name}</h2>
                <div className="flex items-center gap-2 text-gray-200 mb-4">
                  <MapPin size={18} />
                  {selectedCity.country}
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    {selectedCity.popularity}/5 Popularity
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium">
                    <Wallet size={14} />
                    Cost Index: {selectedCity.costIndex}/5
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCity(null)}
                className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors md:hidden"
              >
                <X size={20} />
              </button>
            </div>

            {/* Right Side: Details & Actions */}
            <div className="w-full md:w-1/2 p-8 bg-white flex flex-col relative">
              <button 
                onClick={() => setSelectedCity(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors hidden md:block"
              >
                <X size={24} />
              </button>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top Things to Do</h3>
                {cityActivities.length > 0 ? (
                  <ul className="space-y-3">
                    {cityActivities.map((act) => (
                      <li key={act.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="font-medium text-gray-800">{act.name}</span>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100">${act.estimatedCost}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">Loading activities...</p>
                )}
              </div>

              <div className="mt-auto bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Plan Your Trip Here</h3>
                <p className="text-sm text-gray-500 mb-5">Select dates to instantly create a trip to {selectedCity.name}.</p>
                
                <form onSubmit={handleCreateTrip} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Start Date</label>
                      <input 
                        type="date" 
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">End Date</label>
                      <input 
                        type="date" 
                        required
                        min={startDate}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isCreating}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isCreating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Plus size={18} />
                        Create Trip
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
