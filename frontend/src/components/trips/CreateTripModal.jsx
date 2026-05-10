import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import api from '../../services/api';

export const CreateTripModal = ({ isOpen, onClose, onTripCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverPhoto: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/trips', formData);
      onTripCreated(data);
      onClose();
      // reset form
      setFormData({ name: '', description: '', startDate: '', endDate: '', coverPhoto: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Trip">
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Trip Name"
          placeholder="e.g. Summer Backpacking in Europe"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="startDate"
            type="date"
            label="Start Date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <Input
            id="endDate"
            type="date"
            label="End Date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows="3"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 placeholder-gray-400 transition-all duration-200 resize-none"
            placeholder="What's this trip about?"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <Input
          id="coverPhoto"
          label="Cover Photo URL (Optional)"
          placeholder="https://example.com/image.jpg"
          value={formData.coverPhoto}
          onChange={handleChange}
        />

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Trip
          </Button>
        </div>
      </form>
    </Modal>
  );
};
