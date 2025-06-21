
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Sparkles, Calendar, Loader2, Heart, 
  History, ShoppingBag, CircleDollarSign, 
  Drumstick, Wheat, GanttChart, BarChart, X
} from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { useForm } from "react-hook-form";

// Food items with categories, type, name and calories
interface FoodItem {
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  type: 'veg' | 'nonveg';
  name: string;
  calories: number;
}

// Complete list of Indian dishes
const INDIAN_FOOD_ITEMS: FoodItem[] = [
  // Non-veg dishes
  { category: 'breakfast', type: 'nonveg', name: 'Masala Egg Bhurji', calories: 140 },
  { category: 'breakfast', type: 'nonveg', name: 'Egg White Omelette', calories: 110 },
  { category: 'breakfast', type: 'nonveg', name: 'Boiled Eggs (whole)', calories: 155 },
  { category: 'lunch', type: 'nonveg', name: 'Tandoori Chicken', calories: 150 },
  { category: 'lunch', type: 'nonveg', name: 'Chicken Curry', calories: 200 },
  { category: 'lunch', type: 'nonveg', name: 'Chicken Tikka Masala', calories: 220 },
  { category: 'lunch', type: 'nonveg', name: 'Chicken Biryani', calories: 250 },
  { category: 'lunch', type: 'nonveg', name: 'Keema (minced meat) Curry', calories: 230 },
  { category: 'lunch', type: 'nonveg', name: 'Chicken Saag (spinach chicken)', calories: 180 },
  { category: 'dinner', type: 'nonveg', name: 'Fish Curry', calories: 180 },
  { category: 'dinner', type: 'nonveg', name: 'Grilled Fish', calories: 160 },
  { category: 'dinner', type: 'nonveg', name: 'Prawn Curry', calories: 190 },
  { category: 'dinner', type: 'nonveg', name: 'Mutton Rogan Josh', calories: 250 },
  { category: 'dinner', type: 'nonveg', name: 'Mutton Korma', calories: 260 },
  { category: 'dinner', type: 'nonveg', name: 'Egg Curry', calories: 160 },
  { category: 'dinner', type: 'nonveg', name: 'Grilled Chicken Breast', calories: 165 },
  { category: 'dinner', type: 'nonveg', name: 'Prawn Masala', calories: 200 },
  { category: 'snack', type: 'nonveg', name: 'Chicken Tikka (skewered)', calories: 170 },
  { category: 'snack', type: 'nonveg', name: 'Fish Tikka', calories: 150 },
  { category: 'snack', type: 'nonveg', name: 'Chicken Seekh Kabab', calories: 190 },
  
  // Veg dishes
  { category: 'breakfast', type: 'veg', name: 'Poha', calories: 130 },
  { category: 'breakfast', type: 'veg', name: 'Upma', calories: 150 },
  { category: 'breakfast', type: 'veg', name: 'Vegetable Daliya (broken wheat porridge)', calories: 120 },
  { category: 'breakfast', type: 'veg', name: 'Idli with Sambar', calories: 70 },
  { category: 'breakfast', type: 'veg', name: 'Ragi Dosa', calories: 110 },
  { category: 'breakfast', type: 'veg', name: 'Besan Chilla (chickpea pancake)', calories: 150 },
  { category: 'lunch', type: 'veg', name: 'Vegetable Pulao', calories: 140 },
  { category: 'lunch', type: 'veg', name: 'Rajma Masala (kidney beans in gravy)', calories: 140 },
  { category: 'lunch', type: 'veg', name: 'Chana Masala', calories: 150 },
  { category: 'lunch', type: 'veg', name: 'Palak Paneer', calories: 200 },
  { category: 'lunch', type: 'veg', name: 'Matar Paneer', calories: 180 },
  { category: 'lunch', type: 'veg', name: 'Dal Tadka', calories: 150 },
  { category: 'lunch', type: 'veg', name: 'Vegetable Biryani', calories: 150 },
  { category: 'lunch', type: 'veg', name: 'Tofu Stir-Fry (Indian style)', calories: 90 },
  { category: 'lunch', type: 'veg', name: 'Veg Khichdi', calories: 130 },
  { category: 'lunch', type: 'veg', name: 'Methi Thepla', calories: 140 },
  { category: 'dinner', type: 'veg', name: 'Baingan Bharta', calories: 100 },
  { category: 'dinner', type: 'veg', name: 'Aloo Gobi', calories: 120 },
  { category: 'dinner', type: 'veg', name: 'Bhindi Masala (okra stir-fry)', calories: 110 },
  { category: 'dinner', type: 'veg', name: 'Mixed Vegetable Curry', calories: 130 },
  { category: 'dinner', type: 'veg', name: 'Paneer Bhurji', calories: 180 },
  { category: 'dinner', type: 'veg', name: 'Kadai Paneer', calories: 200 },
  { category: 'dinner', type: 'veg', name: 'Lauki (bottle gourd) Curry', calories: 80 },
  { category: 'dinner', type: 'veg', name: 'Cabbage Stir Fry', calories: 50 },
  { category: 'snack', type: 'veg', name: 'Dhokla', calories: 80 },
  { category: 'snack', type: 'veg', name: 'Masala Dhokla', calories: 90 },
  { category: 'snack', type: 'veg', name: 'Baked Vegetable Samosa', calories: 150 },
  { category: 'snack', type: 'veg', name: 'Sprout Salad', calories: 100 },
  { category: 'snack', type: 'veg', name: 'Roasted Makhana (fox nuts)', calories: 120 },
  { category: 'snack', type: 'veg', name: 'Fruit Chaat', calories: 90 },
];

// Meal plan type
interface MealPlan {
  day: string;
  breakfast: FoodItem;
  lunch: FoodItem;
  dinner: FoodItem;
  snack: FoodItem;
  totalCalories: number;
}

// Favorite dish type
interface FavoriteDish extends FoodItem {
  id: string;
  dateAdded: string;
}

// Food history type
interface FoodHistory {
  date: string;
  mealPlan: MealPlan;
}

// Form values type
interface FormValues {
  dietType: 'veg' | 'nonveg' | 'mixed';
  planDays: string;
  calorieTarget: string;
  dayWisePreference: boolean;
  vegDays: string[];
  includeUserItems: boolean;
}

interface AIFoodPlannerProps {
  userFoodItems: string[];
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AIFoodPlanner: React.FC<AIFoodPlannerProps> = ({ userFoodItems }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [favoriteDishes, setFavoriteDishes] = useState<FavoriteDish[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [mealHistory, setMealHistory] = useState<FoodHistory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("plan");

  // Initialize form
  const form = useForm<FormValues>({
    defaultValues: {
      dietType: 'mixed',
      planDays: '3',
      calorieTarget: '1500',
      dayWisePreference: false,
      vegDays: [],
      includeUserItems: true
    }
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteDishes');
    if (savedFavorites) {
      try {
        setFavoriteDishes(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse saved favorites:', error);
      }
    }

    const savedHistory = localStorage.getItem('mealHistory');
    if (savedHistory) {
      try {
        setMealHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse saved history:', error);
      }
    }
  }, []);

  // Filter foods based on diet type, category, and optionally day preferences
  const filterFoodItems = (
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    dietType: 'veg' | 'nonveg' | 'mixed',
    day?: string
  ): FoodItem[] => {
    // Get day-wise preference
    const dayWisePreference = form.getValues('dayWisePreference');
    const vegDays = form.getValues('vegDays');
    
    // If day-wise preference is enabled and we have a day
    let effectiveDietType = dietType;
    if (dayWisePreference && day && vegDays.includes(day)) {
      effectiveDietType = 'veg';
    }
    
    return INDIAN_FOOD_ITEMS.filter(food => {
      const categoryMatch = food.category === category;
      let typeMatch = true;
      
      if (effectiveDietType === 'veg') {
        typeMatch = food.type === 'veg';
      } else if (effectiveDietType === 'nonveg') {
        typeMatch = food.type === 'nonveg';
      }
      
      return categoryMatch && typeMatch;
    });
  };

  // Get a random food item from the filtered list
  const getRandomFoodItem = (
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    dietType: 'veg' | 'nonveg' | 'mixed',
    day: string,
    excludeItems: FoodItem[] = []
  ): FoodItem => {
    // Get filtered food items
    let availableItems = [...filterFoodItems(category, dietType, day)];
    
    // Include user items if enabled (simplified, as we'd need to properly categorize them)
    const includeUserItems = form.getValues('includeUserItems');
    if (includeUserItems && userFoodItems.length > 0) {
      // Simple approach - add as a snack only
      if (category === 'snack') {
        userFoodItems.forEach(item => {
          // Create a basic food item for user items (assuming veg)
          availableItems.push({
            category: 'snack',
            type: 'veg',
            name: item,
            calories: 100 // Default calories
          });
        });
      }
    }
    
    // Remove excluded items
    availableItems = availableItems.filter(item => 
      !excludeItems.some(excluded => excluded.name === item.name)
    );
    
    // If no items available, return from the original complete list for that category
    if (availableItems.length === 0) {
      availableItems = INDIAN_FOOD_ITEMS.filter(food => food.category === category);
    }
    
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    return availableItems[randomIndex];
  };

  // Generate shopping list based on meal plan
  const generateShoppingList = (mealPlan: MealPlan[]) => {
    // This is a placeholder. In a real app, you would have recipes with ingredients.
    // For now, we'll just create a simple list based on dish names
    const items = new Set<string>();
    
    mealPlan.forEach(day => {
      // Breakfast ingredients (simple approximation)
      if (day.breakfast.name.includes('Egg')) {
        items.add('Eggs');
      }
      if (day.breakfast.name.includes('Poha')) {
        items.add('Flattened rice (Poha)');
        items.add('Onions');
        items.add('Mustard seeds');
      }
      // Add more ingredient logic based on dish names
      
      // Common ingredients
      items.add('Salt');
      items.add('Oil');
      items.add('Spices (garam masala, turmeric, chili powder)');
      items.add('Onions');
      items.add('Tomatoes');
      items.add('Garlic');
      items.add('Ginger');
      
      // More specific ingredients based on dish types
      if (day.lunch.name.includes('Paneer') || day.dinner.name.includes('Paneer')) {
        items.add('Paneer (Indian cottage cheese)');
      }
      if (day.lunch.name.includes('Chicken') || day.dinner.name.includes('Chicken')) {
        items.add('Chicken');
      }
      if (day.lunch.name.includes('Rice') || day.lunch.name.includes('Biryani')) {
        items.add('Basmati rice');
      }
    });
    
    return Array.from(items);
  };

  // Add a dish to favorites
  const addToFavorites = (dish: FoodItem) => {
    const newFavorite: FavoriteDish = {
      ...dish,
      id: `${dish.name}-${Date.now()}`,
      dateAdded: new Date().toISOString()
    };
    
    const updatedFavorites = [...favoriteDishes, newFavorite];
    setFavoriteDishes(updatedFavorites);
    localStorage.setItem('favoriteDishes', JSON.stringify(updatedFavorites));
    toast.success(`Added ${dish.name} to favorites!`);
  };

  // Remove a dish from favorites
  const removeFromFavorites = (id: string) => {
    const updatedFavorites = favoriteDishes.filter(dish => dish.id !== id);
    setFavoriteDishes(updatedFavorites);
    localStorage.setItem('favoriteDishes', JSON.stringify(updatedFavorites));
    toast.info(`Removed from favorites`);
  };

  // Save meal plan to history
  const saveMealPlanToHistory = (plan: MealPlan[]) => {
    const historyEntries: FoodHistory[] = plan.map(day => ({
      date: new Date().toISOString(),
      mealPlan: day
    }));
    
    const updatedHistory = [...mealHistory, ...historyEntries];
    setMealHistory(updatedHistory);
    localStorage.setItem('mealHistory', JSON.stringify(updatedHistory));
    toast.success("Meal plan saved to history!");
  };

  // Generate meal plan
  const generateMealPlan = (values: FormValues) => {
    setIsGenerating(true);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      try {
        const newMealPlan: MealPlan[] = [];
        const numDays = parseInt(values.planDays);
        const targetCalories = parseInt(values.calorieTarget);
        
        // Generate meal plan for the specified number of days
        for (let i = 0; i < numDays; i++) {
          const dayName = days[i % 7];
          const dayItems: FoodItem[] = [];
          
          // For each day, attempt to build a meal plan that meets the calorie target
          let attempts = 0;
          let totalCalories = 0;
          
          // Get breakfast
          const breakfast = getRandomFoodItem('breakfast', values.dietType, dayName, dayItems);
          dayItems.push(breakfast);
          totalCalories += breakfast.calories;
          
          // Get lunch
          const lunch = getRandomFoodItem('lunch', values.dietType, dayName, dayItems);
          dayItems.push(lunch);
          totalCalories += lunch.calories;
          
          // Get dinner
          const dinner = getRandomFoodItem('dinner', values.dietType, dayName, dayItems);
          dayItems.push(dinner);
          totalCalories += dinner.calories;
          
          // Get snack - try to get close to calorie target
          const snack = getRandomFoodItem('snack', values.dietType, dayName, dayItems);
          dayItems.push(snack);
          totalCalories += snack.calories;
          
          // Create day's meal plan
          newMealPlan.push({
            day: dayName,
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner,
            snack: snack,
            totalCalories: totalCalories
          });
        }
        
        setMealPlan(newMealPlan);
        setShoppingList(generateShoppingList(newMealPlan));
        saveMealPlanToHistory(newMealPlan);
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
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={activeTab === "plan" ? "default" : "outline"} 
          onClick={() => setActiveTab("plan")}
          className="flex items-center gap-2"
        >
          <GanttChart className="h-4 w-4" />
          Meal Planner
        </Button>
        <Button 
          variant={activeTab === "favorites" ? "default" : "outline"} 
          onClick={() => { setActiveTab("favorites"); setShowFavorites(true); }}
          className="flex items-center gap-2"
        >
          <Heart className="h-4 w-4" />
          Favorites
        </Button>
        <Button 
          variant={activeTab === "history" ? "default" : "outline"} 
          onClick={() => { setActiveTab("history"); setShowHistory(true); }}
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          History
        </Button>
        {mealPlan.length > 0 && (
          <Button 
            variant={activeTab === "shopping" ? "default" : "outline"} 
            onClick={() => { setActiveTab("shopping"); setShowShoppingList(true); }}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Shopping List
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "plan" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(generateMealPlan)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dietType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Diet Preference</FormLabel>
                        <div className="flex flex-col gap-1">
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="flex flex-col space-y-1 pt-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="veg" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <Wheat className="h-4 w-4 mr-2 text-green-600" />
                                Vegetarian Only
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="nonveg" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <Drumstick className="h-4 w-4 mr-2 text-amber-600" />
                                Non-Vegetarian Only
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mixed" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Mixed (Both Veg and Non-Veg)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="planDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of days</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select days" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 2, 3, 5, 7].map(day => (
                                <SelectItem key={day} value={day.toString()}>
                                  {day} {day === 1 ? 'day' : 'days'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="calorieTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Calories Per Day</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select calorie target" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1200, 1500, 1800, 2000, 2200, 2500].map(cal => (
                                <SelectItem key={cal} value={cal.toString()}>
                                  {cal} calories
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="dayWisePreference"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Day-wise Diet Preference
                        </FormLabel>
                        <FormDescription>
                          Set specific days for vegetarian meals
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("dayWisePreference") && (
                  <FormField
                    control={form.control}
                    name="vegDays"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel className="text-base">
                            Select Vegetarian Days
                          </FormLabel>
                          <FormDescription>
                            These days will only include vegetarian dishes
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                          {days.map((day) => (
                            <FormField
                              key={day}
                              control={form.control}
                              name="vegDays"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={day}
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, day])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== day
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {day}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="includeUserItems"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Include My Food Items
                        </FormLabel>
                        <FormDescription>
                          Add your food items to the meal planning options
                          {userFoodItems.length === 0 && " (none added yet)"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={userFoodItems.length === 0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit"
                  disabled={isGenerating}
                  className={cn(
                    "w-full bg-primary/90 hover:bg-primary text-white px-6 py-5 rounded-xl transition-all shadow-md shadow-primary/10",
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
              </form>
            </Form>

            <AnimatePresence>
              {mealPlan.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="overflow-x-auto pb-4"
                >
                  <Table className="meal-plan-table">
                    <TableCaption>Meal plan based on your preferences.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-primary" />
                            Day
                          </div>
                        </TableHead>
                        <TableHead>Breakfast</TableHead>
                        <TableHead>Lunch</TableHead>
                        <TableHead>Dinner</TableHead>
                        <TableHead>Snack</TableHead>
                        <TableHead className="text-right">
                          <div className="flex items-center justify-end">
                            <BarChart className="mr-2 h-4 w-4 text-primary" />
                            Calories
                          </div>
                        </TableHead>
                        <TableHead className="w-[70px] text-right">Favorite</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mealPlan.map((day, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <TableCell className="font-medium">{day.day}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-between">
                              <span>{day.breakfast.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => addToFavorites(day.breakfast)}
                                className="h-6 w-6 p-0 ml-2"
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500">
                              {day.breakfast.calories} cal | {day.breakfast.type === 'veg' ? 
                                <span className="text-green-600">Veg</span> : 
                                <span className="text-amber-600">Non-Veg</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-between">
                              <span>{day.lunch.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => addToFavorites(day.lunch)}
                                className="h-6 w-6 p-0 ml-2"
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500">
                              {day.lunch.calories} cal | {day.lunch.type === 'veg' ? 
                                <span className="text-green-600">Veg</span> : 
                                <span className="text-amber-600">Non-Veg</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-between">
                              <span>{day.dinner.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => addToFavorites(day.dinner)}
                                className="h-6 w-6 p-0 ml-2"
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500">
                              {day.dinner.calories} cal | {day.dinner.type === 'veg' ? 
                                <span className="text-green-600">Veg</span> : 
                                <span className="text-amber-600">Non-Veg</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-between">
                              <span>{day.snack.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => addToFavorites(day.snack)}
                                className="h-6 w-6 p-0 ml-2"
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500">
                              {day.snack.calories} cal | {day.snack.type === 'veg' ? 
                                <span className="text-green-600">Veg</span> : 
                                <span className="text-amber-600">Non-Veg</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-medium">{day.totalCalories}</span>
                            <span className="text-xs text-gray-500 ml-1">cal</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <CircleDollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-semibold ml-1">
                                ₹{Math.round(day.totalCalories / 10)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <p className="text-xs text-gray-500 mt-4 italic">
                    Note: This Indian meal plan is generated using an algorithm with traditional Indian dishes. 
                    Adjust portions and ingredients according to your dietary needs and preferences.
                    Estimated cost is approximate.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === "favorites" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              Your Favorite Dishes
            </h3>
            
            {favoriteDishes.length > 0 ? (
              <div className="space-y-2">
                {favoriteDishes.map(dish => (
                  <div 
                    key={dish.id} 
                    className="p-3 rounded-lg border border-gray-100 bg-white flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{dish.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{dish.category}</span>
                        <span>•</span>
                        <span className={dish.type === 'veg' ? 'text-green-600' : 'text-amber-600'}>
                          {dish.type === 'veg' ? 'Veg' : 'Non-Veg'}
                        </span>
                        <span>•</span>
                        <span>{dish.calories} cal</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFromFavorites(dish.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't added any favorite dishes yet.</p>
                <p className="text-sm mt-2">
                  Generate a meal plan and click the heart icon next to dishes you like.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <History className="h-5 w-5 text-blue-500 mr-2" />
              Your Meal History
            </h3>
            
            {mealHistory.length > 0 ? (
              <div className="space-y-4">
                {mealHistory.slice(-5).reverse().map((entry, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border border-gray-100 bg-white"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-gray-700">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.mealPlan.day}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-1">
                        <div className="font-medium text-primary">Breakfast</div>
                        <div>{entry.mealPlan.breakfast.name}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-primary">Lunch</div>
                        <div>{entry.mealPlan.lunch.name}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-primary">Dinner</div>
                        <div>{entry.mealPlan.dinner.name}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-primary">Snack</div>
                        <div>{entry.mealPlan.snack.name}</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-right text-sm text-gray-600">
                      Total: {entry.mealPlan.totalCalories} calories
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No meal history available yet.</p>
                <p className="text-sm mt-2">
                  Generate a meal plan to start building your history.
                </p>
              </div>
            )}
            
            {mealHistory.length > 5 && (
              <div className="text-center mt-4">
                <Button variant="outline" size="sm">
                  View All History
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "shopping" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingBag className="h-5 w-5 text-emerald-500 mr-2" />
              Shopping List
            </h3>
            
            {shoppingList.length > 0 ? (
              <div className="space-y-2">
                {shoppingList.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg border border-gray-100 bg-white flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox id={`item-${index}`} />
                      <label htmlFor={`item-${index}`} className="text-gray-700">
                        {item}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No shopping list available yet.</p>
                <p className="text-sm mt-2">
                  Generate a meal plan to create a shopping list.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIFoodPlanner;
