
import React from 'react';
import { Shuffle, AlertCircle, Utensils } from 'lucide-react';
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePickFood}
        className="button-hover bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-xl px-8 py-4 flex items-center justify-center gap-2 shadow-lg shadow-teal-200/50 transition-all duration-300"
      >
        <Shuffle className="h-5 w-5" />
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
            className="mt-8 p-6 w-full max-w-md rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 shadow-xl shadow-teal-100/50"
          >
            <div className="text-center">
              <span className="text-xs font-medium text-teal-600 uppercase tracking-wider">Your selected food</span>
              <div className="relative">
                <motion.div
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-teal-300 to-cyan-300 blur-xl opacity-40"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <h3 className="text-3xl font-bold mt-2 mb-1 text-gray-900">{selectedFood}</h3>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Utensils className="h-4 w-4 text-teal-500" />
                <p className="text-teal-700 text-sm">Enjoy your healthy meal!</p>
              </div>
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
            className="mt-8 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg"
          >
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <p>Add some food items to get started!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodPicker;
