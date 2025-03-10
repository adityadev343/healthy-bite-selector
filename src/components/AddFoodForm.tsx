
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
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
          <input
            type="text"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            placeholder="Enter a healthy food item..."
            className="w-full p-4 pr-12 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="button-hover bg-primary text-white font-medium rounded-xl px-6 py-4 flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Add Food Item</span>
        </motion.button>
      </div>
    </form>
  );
};

export default AddFoodForm;
