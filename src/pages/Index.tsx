
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddFoodForm from '../components/AddFoodForm';
import FoodPicker from '../components/FoodPicker';
import FoodItem from '../components/FoodItem';
import Instructions from '../components/Instructions';
import AIFoodPlanner from '../components/AIFoodPlanner';
import { toast } from "sonner";
import { Utensils, CalendarDays } from 'lucide-react';
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
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background spotlight effect */}
      <div 
        className="spotlight animate-spotlight"
        style={{ 
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
      
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
            <Utensils className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Healthy Food Picker
          </h1>
          <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="food-picker"
              className="flex items-center gap-2"
            >
              <Utensils className="h-4 w-4" />
              <span>Food Picker</span>
            </TabsTrigger>
            <TabsTrigger 
              value="meal-planner"
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Indian Meal Planner</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="food-picker" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Your Food List {foodItems.length > 0 && `(${foodItems.length})`}
                </h2>
                
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-gray-100 min-h-[200px]">
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
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Food Selector</h2>
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
                  <FoodPicker
                    foodItems={foodItems}
                    selectedFood={selectedFood}
                    onPickFood={handlePickFood}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="meal-planner" className="mt-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Indian Meal Planner</h2>
              <p className="text-gray-600 mb-6">
                Generate a custom Indian meal plan with authentic dishes. The AI will create a balanced plan of traditional Indian cuisine and optionally include items from your list.
              </p>
              
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                <AIFoodPlanner userFoodItems={foodItems} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
