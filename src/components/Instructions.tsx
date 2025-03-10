
import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full mb-8">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2">
          <Info size={18} className="text-primary" />
          <span className="font-medium">How it works</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2 text-gray-600 text-sm space-y-2">
              <p>1. Add your favorite healthy food items using the input field above.</p>
              <p>2. Click the "Choose Random Food" button to randomly select one from your list.</p>
              <p>3. The selected food will be displayed prominently.</p>
              <p>4. Use this tool to help maintain variety in your healthy diet by cycling through different foods.</p>
              <p>5. Remove any food item by clicking the "X" button next to it.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Instructions;
