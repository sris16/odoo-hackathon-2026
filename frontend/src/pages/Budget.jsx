import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PieChart as PieChartIcon } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const Budget = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Since we don't have a route that lists ALL budgets for ALL trips directly,
  // we either expect an ID in the URL, or we fetch the first trip and show its budget.
  // For simplicity, if no ID is provided, we fetch the first trip.
  
  useEffect(() => {
    fetchBudget();
  }, [id]);

  const fetchBudget = async () => {
    try {
      let targetId = id;
      if (!targetId) {
        // Fallback: get first trip
        const { data: trips } = await api.get('/trips');
        if (trips.length > 0) {
          targetId = trips[0].id;
        }
      }

      if (targetId) {
        const { data } = await api.get(`/trips/${targetId}/budget`);
        setBudget(data);
      }
    } catch (error) {
      console.error('Failed to fetch budget', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center mt-20"><div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div></div>;
  }

  if (!budget) {
    return <div className="p-8 text-center text-gray-500">No budget data available. Create a trip first!</div>;
  }

  const pieData = {
    labels: ['Activities', 'Accommodation (Stay)', 'Transportation'],
    datasets: [
      {
        data: [
          budget.breakdown.activities,
          budget.breakdown.stay,
          budget.breakdown.transportation
        ],
        backgroundColor: [
          'rgba(20, 184, 166, 0.8)', // brand-500
          'rgba(99, 102, 241, 0.8)', // indigo-500
          'rgba(245, 158, 11, 0.8)', // amber-500
        ],
        borderColor: [
          'rgba(20, 184, 166, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: budget.cityBreakdown?.map(c => c.city) || [],
    datasets: [
      {
        label: 'Cost per City ($)',
        data: budget.cityBreakdown?.map(c => c.cost) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 8,
      }
    ]
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        {id && (
          <Link to={`/trips/${id}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Analysis</h1>
          <p className="text-gray-500 mt-1">Dynamic cost breakdown for your trip.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg flex flex-col justify-center">
          <h2 className="text-gray-400 font-medium mb-2 uppercase tracking-wide text-sm">Total Estimated Cost</h2>
          <p className="text-5xl font-bold mb-6">{formatCurrency(budget.totalBudget)}</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <span className="text-gray-400">Activities</span>
              <span className="font-semibold">{formatCurrency(budget.breakdown.activities)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <span className="text-gray-400">Stay</span>
              <span className="font-semibold">{formatCurrency(budget.breakdown.stay)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Transport</span>
              <span className="font-semibold">{formatCurrency(budget.breakdown.transportation)}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[350px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 w-full text-left">Category Breakdown</h3>
            <div className="w-full max-w-sm">
              <Pie 
                data={pieData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }} 
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[350px]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 w-full text-left">Cost by Destination</h3>
            <div className="w-full h-full flex items-center justify-center">
              {budget.cityBreakdown && budget.cityBreakdown.length > 0 ? (
                <Bar 
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              ) : (
                <p className="text-gray-400">No destination data yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
