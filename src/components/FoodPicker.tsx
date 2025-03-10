
import React from 'react';
import { Shuffle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";

interface FoodPickerProps {
  foodItems: string[];
  selectedFood: string | null;
  onPickFood: () => void;
}

const FoodPicker: React.FC<FoodPickerProps> = ({ 
  foodItems, 
  selectedFood, 
  onPickFood 
}) => {
  const handlePickFood = () => {
    if (foodItems.length === 0) {
      toast.error("Please add some food items first!", {
        description: "You need to have at least one food item to make a selection."
      });
      return;
    }
    
    onPickFood();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handlePickFood}
        className="button-hover bg-primary text-primary-foreground font-medium rounded-xl px-8 py-4 flex items-center justify-center gap-2 shadow-md shadow-primary/20"
      >
        <Shuffle size={20} />
        <span>Choose Random Food</span>
      </motion.button>
      
      <AnimatePresence mode="wait">
        {selectedFood && (
          <motion.div
            key={selectedFood}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30 
            }}
            className="mt-8 p-6 w-full max-w-md rounded-2xl glass-card highlight-item border border-primary/30 shadow-lg"
          >
            <div className="text-center">
              <span className="text-xs font-medium text-primary/60 uppercase tracking-wider">Your selected food</span>
              <h3 className="text-3xl font-bold mt-2 mb-1 text-gray-900">{selectedFood}</h3>
              <p className="text-gray-500 text-sm">Enjoy your healthy meal!</p>
            </div>
          </motion.div>
        )}
        
        {!selectedFood && foodItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center text-gray-500"
          >
            <p>Click the button to pick a random healthy food from your list.</p>
          </motion.div>
        )}
        
        {!selectedFood && foodItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex items-center gap-2 text-amber-500"
          >
            <AlertCircle size={16} />
            <p>Add some food items to get started!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodPicker;
