
import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodItemProps {
  name: string;
  onRemove: () => void;
  isSelected?: boolean;
}

const FoodItem: React.FC<FoodItemProps> = ({ name, onRemove, isSelected = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
      className={`food-card flex items-center justify-between p-4 rounded-xl mb-2 ${
        isSelected 
          ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 shadow-md shadow-teal-100/50 highlight-item' 
          : 'bg-white/80 border border-gray-100 hover:border-teal-200 hover:shadow-sm hover:shadow-teal-50/50'
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <span className={`font-medium ${isSelected ? 'text-teal-700' : 'text-gray-800'}`}>{name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-gray-400 hover:text-red-400 p-1 rounded-full transition-colors hover:bg-red-50"
        aria-label={`Remove ${name}`}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default FoodItem;
