
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

// Indian food categories with examples
const INDIAN_FOOD_CATEGORIES = {
  breakfast: ['Idli Sambar', 'Poha', 'Upma', 'Aloo Paratha', 'Masala Dosa', 'Uttapam', 'Vada', 'Besan Chilla', 'Puri Bhaji', 'Methi Thepla'],
  lunch: ['Chole Bhature', 'Rajma Chawal', 'Dal Makhani with Naan', 'Paneer Butter Masala with Rice', 'Vegetable Biryani', 'Palak Paneer with Roti', 'Aloo Gobi with Paratha', 'Sambar Rice', 'Baingan Bharta with Roti', 'Masoor Dal with Jeera Rice'],
  dinner: ['Butter Chicken with Naan', 'Veg Pulao', 'Chana Masala with Roti', 'Kadhai Paneer with Paratha', 'Malai Kofta with Naan', 'Matar Paneer with Rice', 'Dal Tadka with Roti', 'Egg Curry with Paratha', 'Fish Curry with Rice', 'Chicken Biryani'],
  sides: ['Raita', 'Papad', 'Pickle', 'Kachumber Salad', 'Boondi Raita', 'Mango Chutney', 'Tomato Chutney', 'Mint Chutney', 'Coconut Chutney', 'Onion Salad'],
  sweets: ['Gulab Jamun', 'Rasgulla', 'Jalebi', 'Kheer', 'Gajar Ka Halwa', 'Ras Malai', 'Mysore Pak', 'Barfi', 'Ladoo', 'Kulfi']
};

interface MealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

interface AIFoodPlannerProps {
  userFoodItems: string[];
}

const AIFoodPlanner: React.FC<AIFoodPlannerProps> = ({ userFoodItems }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planDays, setPlanDays] = useState<number>(3);
  const [preferUserItems, setPreferUserItems] = useState<boolean>(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const generateRandomFoodItem = (category: keyof typeof INDIAN_FOOD_CATEGORIES, excludeItems: string[] = []): string => {
    let availableItems = [...INDIAN_FOOD_CATEGORIES[category]];
    
    // If user prefers their own items and they have items, include them in the selection pool
    if (preferUserItems && userFoodItems.length > 0) {
      availableItems = [...availableItems, ...userFoodItems];
    }
    
    // Remove items that should be excluded
    availableItems = availableItems.filter(item => !excludeItems.includes(item));
    
    // If no items available, return from the original category
    if (availableItems.length === 0) {
      availableItems = [...INDIAN_FOOD_CATEGORIES[category]];
    }
    
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    return availableItems[randomIndex];
  };

  const generateMealPlan = () => {
    setIsGenerating(true);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      try {
        const newMealPlan: MealPlan[] = [];
        
        // Generate meal plan for the specified number of days
        for (let i = 0; i < planDays; i++) {
          // For each day, ensure we don't repeat items within the day
          const dayExcludeItems: string[] = [];
          
          const breakfast = generateRandomFoodItem('breakfast', dayExcludeItems);
          dayExcludeItems.push(breakfast);
          
          const lunch = generateRandomFoodItem('lunch', dayExcludeItems);
          dayExcludeItems.push(lunch);
          
          const dinner = generateRandomFoodItem('dinner', dayExcludeItems);
          dayExcludeItems.push(dinner);
          
          const snack = i % 2 === 0 ? 
            generateRandomFoodItem('sides', dayExcludeItems) : 
            generateRandomFoodItem('sweets', dayExcludeItems);
          
          newMealPlan.push({
            day: days[i % 7],
            breakfast,
            lunch,
            dinner,
            snack
          });
        }
        
        setMealPlan(newMealPlan);
        toast.success("Indian meal plan generated successfully!");
      } catch (error) {
        console.error("Error generating meal plan:", error);
        toast.error("Failed to generate meal plan. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="space-y-2 flex-1">
            <label htmlFor="days" className="block text-sm font-medium text-gray-700">
              Number of days:
            </label>
            <select
              id="days"
              value={planDays}
              onChange={(e) => setPlanDays(Number(e.target.value))}
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            >
              {[1, 2, 3, 5, 7].map(day => (
                <option key={day} value={day}>{day} {day === 1 ? 'day' : 'days'}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2 flex-1">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={preferUserItems}
                onChange={(e) => setPreferUserItems(e.target.checked)}
                className="rounded text-primary focus:ring-primary/20"
              />
              <span>Include my food items {userFoodItems.length === 0 && "(none added yet)"}</span>
            </label>
          </div>
          
          <Button
            onClick={generateMealPlan}
            disabled={isGenerating}
            className={cn(
              "bg-primary/90 hover:bg-primary text-white px-6 py-5 rounded-xl transition-all shadow-md shadow-primary/10",
              isGenerating && "opacity-80"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Indian Meal Plan
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mealPlan.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-x-auto pb-4"
          >
            <div className="meal-plan-table">
              <table className="min-w-full bg-white shadow-sm rounded-xl overflow-hidden">
                <thead className="bg-primary/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        Day
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Breakfast</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Lunch</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dinner</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Snack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mealPlan.map((day, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{day.day}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{day.breakfast}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{day.lunch}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{day.dinner}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{day.snack}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 italic">
              Note: This Indian meal plan is generated using an algorithm with traditional Indian dishes. 
              Adjust portions and ingredients according to your dietary needs and preferences.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIFoodPlanner;
