
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddFoodForm from '../components/AddFoodForm';
import FoodPicker from '../components/FoodPicker';
import FoodItem from '../components/FoodItem';
import Instructions from '../components/Instructions';
import AIFoodPlanner from '../components/AIFoodPlanner';
import { toast } from "sonner";
import { Utensils, CalendarDays, Sparkles, LeafyGreen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index: React.FC = () => {
  const [foodItems, setFoodItems] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<string>("food-picker");

  // Load food items from localStorage on initial render
  useEffect(() => {
    const savedFoodItems = localStorage.getItem('healthyFoodItems');
    if (savedFoodItems) {
      try {
        setFoodItems(JSON.parse(savedFoodItems));
      } catch (error) {
        console.error('Failed to parse saved food items:', error);
      }
    }
  }, []);

  // Save food items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('healthyFoodItems', JSON.stringify(foodItems));
  }, [foodItems]);

  // Mouse spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleAddFood = (food: string) => {
    // Check if food already exists (case insensitive)
    if (foodItems.some(item => item.toLowerCase() === food.toLowerCase())) {
      toast.error("This food item already exists in your list!");
      return;
    }
    
    setFoodItems([...foodItems, food]);
  };

  const handleRemoveFood = (index: number) => {
    const newFoodItems = [...foodItems];
    const removedItem = newFoodItems[index];
    newFoodItems.splice(index, 1);
    setFoodItems(newFoodItems);
    
    // If we're removing the currently selected food, clear the selection
    if (selectedFood === removedItem) {
      setSelectedFood(null);
    }
    
    toast.info(`Removed ${removedItem} from your list`);
  };

  const handlePickFood = () => {
    if (foodItems.length === 0) return;
    
    // Select a random food from the list
    const randomIndex = Math.floor(Math.random() * foodItems.length);
    const newSelection = foodItems[randomIndex];
    
    // Only show toast if selection changed
    if (newSelection !== selectedFood) {
      toast.success(`Selected: ${newSelection}`, {
        description: "Enjoy your healthy choice!"
      });
    }
    
    setSelectedFood(newSelection);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-50">
        <div className="absolute -left-10 top-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-green-300 to-green-200 blur-xl animate-pulse-soft"></div>
        <div className="absolute right-0 top-1/3 w-60 h-60 rounded-full bg-gradient-to-br from-blue-300 to-purple-200 blur-xl animate-float"></div>
        <div className="absolute bottom-10 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-200 to-orange-100 blur-xl animate-bounce-soft"></div>
      </div>
      
      {/* Background spotlight effect */}
      <div 
        className="spotlight animate-spotlight"
        style={{ 
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10 px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <LeafyGreen className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Healthy Food Picker
          </h1>
          <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
            Simplify your meal planning with random selections from your favorite healthy options.
          </p>
        </motion.div>

        <div className="mb-10">
          <Instructions />
          <AddFoodForm onAddFood={handleAddFood} />
        </div>

        <Tabs 
          defaultValue="food-picker" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-10"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 backdrop-blur-sm border border-green-100 shadow-md overflow-hidden">
            <TabsTrigger 
              value="food-picker"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              <Utensils className="h-4 w-4" />
              <span>Food Picker</span>
            </TabsTrigger>
            <TabsTrigger 
              value="meal-planner"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Indian Meal Planner</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="food-picker" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span className="inline-block w-2 h-8 rounded-full bg-gradient-to-b from-green-500 to-emerald-500"></span>
                  Your Food List {foodItems.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center h-6 min-w-6 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      {foodItems.length}
                    </span>
                  )}
                </h2>
                
                <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-100 shadow-lg shadow-emerald-50 min-h-[200px]">
                  <AnimatePresence>
                    {foodItems.length > 0 ? (
                      <div className="space-y-2">
                        {foodItems.map((food, index) => (
                          <FoodItem
                            key={`${food}-${index}`}
                            name={food}
                            onRemove={() => handleRemoveFood(index)}
                            isSelected={food === selectedFood}
                          />
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex items-center justify-center text-gray-400 text-center p-8"
                      >
                        <p>Your food list is empty. Add some healthy options to get started!</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span className="inline-block w-2 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500"></span>
                  Food Selector
                </h2>
                <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-xl p-6 border border-teal-100 shadow-lg shadow-teal-50 flex flex-col items-center justify-center min-h-[200px]">
                  <FoodPicker
                    foodItems={foodItems}
                    selectedFood={selectedFood}
                    onPickFood={handlePickFood}
                  />
                </div>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="meal-planner" className="mt-2">
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="inline-block w-2 h-8 rounded-full bg-gradient-to-b from-orange-500 to-amber-500"></span>
                Indian Meal Planner
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse-soft" />
              </h2>
              <p className="text-gray-600 mb-6 pl-4 border-l-2 border-amber-300">
                Generate a custom Indian meal plan with authentic dishes. The AI will create a balanced plan of traditional Indian cuisine and optionally include items from your list.
              </p>
              
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-xl p-6 border border-amber-100 shadow-lg shadow-amber-50">
                <AIFoodPlanner userFoodItems={foodItems} />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
