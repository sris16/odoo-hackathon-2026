import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { Input } from '../components/ui/Input';
import api from '../services/api';

export const Explore = () => {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data } = await api.get('/cities');
      setCities(data);
    } catch (error) {
      console.error('Failed to fetch cities', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(search.toLowerCase()) || 
    city.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">Explore Destinations</h1>
          <p className="text-brand-100 mb-6">Find your next adventure from our curated list of global cities.</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search cities or countries..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.6,-46.3C91.4,-33.5,98.1,-18,97.7,-2.6C97.3,12.8,89.9,28.1,80.1,41.4C70.3,54.7,58.2,66.1,44.4,74.2C30.6,82.3,15.3,87.1,-0.1,87.2C-15.5,87.3,-31,82.7,-44.5,74.4C-58,66.1,-69.5,54.1,-78.4,40.1C-87.3,26.1,-93.6,10.1,-94.1,-6.1C-94.6,-22.3,-89.3,-38.7,-79.8,-52.1C-70.3,-65.5,-56.6,-75.9,-41.8,-82.7C-27,-89.5,-13.5,-92.7,0.7,-93.7C14.9,-94.7,29.8,-93.5,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-20"><div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div key={city.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={city.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'} 
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
          ))}
          {filteredCities.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No destinations found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
