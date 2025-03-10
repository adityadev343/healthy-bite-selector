
import React, { useState } from 'react';
import { PlusCircle, LeafyGreen } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";

interface AddFoodFormProps {
  onAddFood: (food: string) => void;
}

const AddFoodForm: React.FC<AddFoodFormProps> = ({ onAddFood }) => {
  const [foodInput, setFoodInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedFood = foodInput.trim();
    
    if (!trimmedFood) {
      toast.error("Please enter a food item");
      return;
    }
    
    onAddFood(trimmedFood);
    setFoodInput('');
    toast.success(`Added ${trimmedFood} to your list!`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-8">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500">
            <LeafyGreen className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            placeholder="Enter a healthy food item..."
            className="w-full p-4 pl-12 pr-12 rounded-xl border border-emerald-200 bg-white/90 backdrop-blur-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all outline-none shadow-md shadow-emerald-50"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="button-hover bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl px-6 py-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-100/50"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Food Item</span>
        </motion.button>
      </div>
    </form>
  );
};

export default AddFoodForm;
