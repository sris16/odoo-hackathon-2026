import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Checklist = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('traveloop_checklist');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Passport and Visa', completed: false, category: 'Documents' },
      { id: '2', text: 'Travel Insurance', completed: false, category: 'Documents' },
      { id: '3', text: 'Universal Power Adapter', completed: false, category: 'Electronics' },
      { id: '4', text: 'Comfortable Walking Shoes', completed: false, category: 'Clothing' },
    ];
  });
  
  const [newItemText, setNewItemText] = useState('');
  const [category, setCategory] = useState('Essentials');

  useEffect(() => {
    localStorage.setItem('traveloop_checklist', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
      category
    };

    setItems([...items, newItem]);
    setNewItemText('');
  };

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Packing Checklist</h1>
        <p className="text-gray-500 mt-1">Never forget the essentials again. Your items save automatically.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input
              label="New Item"
              placeholder="E.g. Sunglasses"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Documents">Documents</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Toiletries">Toiletries</option>
              <option value="Essentials">Essentials</option>
            </select>
          </div>
          <Button type="submit" className="w-full sm:w-auto flex items-center gap-2 h-[46px]">
            <Plus size={18} /> Add
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs">{cat}</h3>
            </div>
            <ul className="divide-y divide-gray-50">
              {items.filter(i => i.category === cat).map(item => (
                <li key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <button 
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center gap-3 text-left"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="text-brand-500" size={20} />
                    ) : (
                      <Circle className="text-gray-300 hover:text-brand-400 transition-colors" size={20} />
                    )}
                    <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                      {item.text}
                    </span>
                  </button>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;
