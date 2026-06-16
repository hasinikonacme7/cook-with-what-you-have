/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MealPlanDay, Recipe } from '../types';
import { Calendar, ShoppingBag, Plus, Sparkles, Trash2, ArrowRight, CheckSquare, Square, DollarSign, Check } from 'lucide-react';

interface MealPlannerProps {
  customRecipes: Recipe[];
  onSelectRecipe?: (recipe: Recipe) => void;
}

const SAMPLE_WEEKLY_RECIPES: Recipe[] = [
  {
    id: "rec_s1",
    title: "Eco-Harvest Turmeric Stir-Fry",
    description: "A gorgeous veg skillet optimized for budget storage.",
    cuisine: "Chinese-Indian",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    costPerServing: 1.85,
    calories: 340,
    protein: "12g",
    carbs: "45g",
    fat: "8g",
    dietTags: ["Vegan", "Gluten-Free", "Budget Meals"],
    ingredientsUsed: ["carrots", "bell peppers", "spinach"],
    ingredientsMissing: [{ name: "giling chickpea cans", estimateCost: 1.10 }],
    instructions: ["Sauté", "Plate"],
    tips: [],
    sustainabilityScore: 92
  },
  {
    id: "rec_s2",
    title: "Rustico Leftover Quesadilla",
    description: "Zesty melted cheese end tortilla.",
    cuisine: "Mexican",
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    costPerServing: 1.45,
    calories: 420,
    protein: "18g",
    carbs: "32g",
    fat: "22g",
    dietTags: ["Vegetarian", "Family Meals"],
    ingredientsUsed: ["cheese", "tomatoes", "tortillas"],
    ingredientsMissing: [{ name: "fresh bunch cilantro", estimateCost: 0.60 }, { name: "sour cream", estimateCost: 1.50 }],
    instructions: ["Grill tortilla"],
    tips: [],
    sustainabilityScore: 88
  },
  {
    id: "rec_s3",
    title: "Starch-Saver Pasta Alfredo",
    description: "Frugal and silky alfredo utilizing surplus cheese milk ends.",
    cuisine: "Italian",
    difficulty: "Easy",
    prepTime: 8,
    cookTime: 10,
    servings: 2,
    costPerServing: 2.10,
    calories: 490,
    protein: "14g",
    carbs: "62g",
    fat: "16g",
    dietTags: ["Vegetarian", "Family Meals"],
    ingredientsUsed: ["milk", "cheese", "pasta"],
    ingredientsMissing: [{ name: "fresh chopped parsley", estimateCost: 0.80 }, { name: "garlic cloves pack", estimateCost: 0.40 }],
    instructions: ["Boil pasta", "Mix with cream sauce"],
    tips: [],
    sustainabilityScore: 85
  },
  {
    id: "rec_s4",
    title: "Gold Crispy Egg Fried Rice",
    description: "Zesty rapid stir-frying rescue for older cold grains.",
    cuisine: "Chinese",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    costPerServing: 1.25,
    calories: 460,
    protein: "15g",
    carbs: "58g",
    fat: "13g",
    dietTags: ["Gluten-Free", "Budget Meals"],
    ingredientsUsed: ["rice"],
    ingredientsMissing: [{ name: "chicken eggs carton", estimateCost: 1.80 }, { name: "dark soy sauce bottle", estimateCost: 1.20 }],
    instructions: ["Toss old rice", "Stir-fry eggs"],
    tips: [],
    sustainabilityScore: 98
  }
];

export default function MealPlanner({ customRecipes }: MealPlannerProps) {
  const [planner, setPlanner] = useState<MealPlanDay[]>([
    { day: 'Monday', meals: [] },
    { day: 'Tuesday', meals: [] },
    { day: 'Wednesday', meals: [] },
    { day: 'Thursday', meals: [] },
    { day: 'Friday', meals: [] },
  ]);

  const [slotSelector, setSlotSelector] = useState<{ day: string; type: 'Breakfast' | 'Lunch' | 'Dinner' } | null>(null);
  const [checkoutNotification, setCheckoutNotification] = useState<string | null>(null);

  // Pool all available recipes (defaults + custom generated ones)
  const availableRecipes = [...SAMPLE_WEEKLY_RECIPES, ...customRecipes];

  const handleAutoPlan = () => {
    const updated = planner.map(day => {
      // Pick random dishes
      const bOption = availableRecipes[0];
      const lOption = availableRecipes[1 % availableRecipes.length];
      const dOption = availableRecipes[2 % availableRecipes.length];
      return {
        ...day,
        meals: [
          { id: `auto_b_${day.day}`, type: 'Breakfast' as const, recipeId: bOption.id, recipeName: bOption.title },
          { id: `auto_l_${day.day}`, type: 'Lunch' as const, recipeId: lOption.id, recipeName: lOption.title },
          { id: `auto_d_${day.day}`, type: 'Dinner' as const, recipeId: dOption.id, recipeName: dOption.title }
        ]
      };
    });
    setPlanner(updated);
  };

  const clearWeek = () => {
    setPlanner(planner.map(day => ({ ...day, meals: [] })));
  };

  const selectRecipeForSlot = (recipe: Recipe) => {
    if (!slotSelector) return;
    const { day, type } = slotSelector;

    const updated = planner.map(d => {
      if (d.day === day) {
        // Remove existing slot of same type if present, then add new
        const filteredMeals = d.meals.filter(m => m.type !== type);
        return {
          ...d,
          meals: [
            ...filteredMeals,
            { id: `${day}_${type}_${Date.now()}`, type, recipeId: recipe.id, recipeName: recipe.title }
          ]
        };
      }
      return d;
    });

    setPlanner(updated);
    setSlotSelector(null);
  };

  const deleteSlot = (day: string, type: 'Breakfast' | 'Lunch' | 'Dinner') => {
    const updated = planner.map(d => {
      if (d.day === day) {
        return {
          ...d,
          meals: d.meals.filter(m => m.type !== type)
        };
      }
      return d;
    });
    setPlanner(updated);
  };

  // Compile unique missing groceries dynamically based on items currently planned
  const activePlanRecipes = planner.flatMap(day => 
    day.meals.map(meal => availableRecipes.find(r => r.id === meal.recipeId))
  ).filter((r): r is Recipe => !!r);

  const missingChecklist: { name: string; estimateCost: number; recipeSources: string[] }[] = [];
  activePlanRecipes.forEach(recipe => {
    recipe.ingredientsMissing.forEach(item => {
      const match = missingChecklist.find(x => x.name.toLowerCase() === item.name.toLowerCase());
      if (match) {
        if (!match.recipeSources.includes(recipe.title)) {
          match.recipeSources.push(recipe.title);
        }
      } else {
        missingChecklist.push({
          name: item.name,
          estimateCost: item.estimateCost,
          recipeSources: [recipe.title]
        });
      }
    });
  });

  const totalGroceryCost = missingChecklist.reduce((sum, item) => sum + item.estimateCost, 0);

  const simulateCheckout = (broker: 'Instacart' | 'AmazonFresh') => {
    setCheckoutNotification(`Filling ${broker} shopping cart with ${missingChecklist.length} missing items (Est. $${totalGroceryCost.toFixed(2)})...`);
    setTimeout(() => {
      setCheckoutNotification(`Success! ${missingChecklist.length} missing ingredients mapped directly to your ${broker} account. Your virtual delivery slot is booked! 🎉`);
      setTimeout(() => setCheckoutNotification(null), 5000);
    }, 2000);
  };

  return (
    <div className="space-y-8" id="meal-planner-view">
      {/* Banner controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-natural-green-light/40 border border-natural-green/20 rounded-2xl p-5 gap-4">
        <div className="space-y-1">
          <h3 className="text-natural-dark font-bold font-sans text-md flex items-center gap-2">
            <Calendar className="w-5 h-5 text-natural-green animate-bounce" />
            Weekly Zero-Waste Bento Planner
          </h3>
          <p className="text-natural-text text-xs">
            Plan breakfast, lunch, and dinner to align with ingredient expiry schedules, auto-mapping missing grocery checklists.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            id="btn-auto-plan-week"
            onClick={handleAutoPlan}
            className="px-4 py-2 rounded-xl text-xs bg-natural-green hover:bg-natural-green-hover text-white font-medium flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Auto-Plan Week
          </button>
          <button
            id="btn-clear-plan-week"
            onClick={clearWeek}
            className="px-4 py-2 rounded-xl text-xs bg-white border border-natural-border text-natural-dark hover:bg-natural-light-bg font-medium transition cursor-pointer"
          >
            Clear Week
          </button>
        </div>
      </div>

      {checkoutNotification && (
        <div className="p-4 bg-natural-green text-white font-sans text-xs font-medium rounded-xl animate-pulse shadow-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{checkoutNotification}</span>
        </div>
      )}

      {/* Grid calendar slots */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {planner.map((dayPlan) => {
          const bMeal = dayPlan.meals.find(m => m.type === 'Breakfast');
          const lMeal = dayPlan.meals.find(m => m.type === 'Lunch');
          const dMeal = dayPlan.meals.find(m => m.type === 'Dinner');

          return (
            <div key={dayPlan.day} className="bg-white border border-natural-border rounded-2xl p-4 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="border-b border-natural-border pb-2 flex items-center justify-between">
                <span className="font-sans font-bold text-sm text-natural-dark">{dayPlan.day}</span>
                <span className="font-mono text-[10px] text-natural-green bg-natural-green-light px-2 py-0.5 rounded-full font-bold">
                  {dayPlan.meals.length}/3 Filled
                </span>
              </div>

              {/* Bento slots */}
              <div className="space-y-3 flex-1 py-1">
                {/* Breakfast slot */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-natural-light-muted block uppercase">Breakfast</span>
                  {bMeal ? (
                    <div className="p-2.5 bg-natural-green-light/40 border border-natural-green/20 rounded-xl text-xs flex justify-between items-start group">
                      <span className="text-natural-dark font-medium line-clamp-2">{bMeal.recipeName}</span>
                      <button
                        id={`btn-del-${dayPlan.day}-Breakfast`}
                        onClick={() => deleteSlot(dayPlan.day, 'Breakfast')}
                        className="text-natural-light-muted hover:text-red-500 transition ml-2 mt-0.5 opacity-10 md:opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn-add-${dayPlan.day}-Breakfast`}
                      onClick={() => setSlotSelector({ day: dayPlan.day, type: 'Breakfast' })}
                      className="w-full dashed-border hover:bg-natural-light-bg text-[11px] text-natural-muted p-2 rounded-xl text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-natural-green" /> Assign meal
                    </button>
                  )}
                </div>

                {/* Lunch slot */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-natural-light-muted block uppercase">Lunch</span>
                  {lMeal ? (
                    <div className="p-2.5 bg-natural-green-light/40 border border-natural-green/20 rounded-xl text-xs flex justify-between items-start group">
                      <span className="text-natural-dark font-medium line-clamp-2">{lMeal.recipeName}</span>
                      <button
                        id={`btn-del-${dayPlan.day}-Lunch`}
                        onClick={() => deleteSlot(dayPlan.day, 'Lunch')}
                        className="text-natural-light-muted hover:text-red-500 transition ml-2 mt-0.5 opacity-10 md:opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn-add-${dayPlan.day}-Lunch`}
                      onClick={() => setSlotSelector({ day: dayPlan.day, type: 'Lunch' })}
                      className="w-full dashed-border hover:bg-natural-light-bg text-[11px] text-natural-muted p-2 rounded-xl text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-natural-green" /> Assign meal
                    </button>
                  )}
                </div>

                {/* Dinner slot */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-natural-light-muted block uppercase">Dinner</span>
                  {dMeal ? (
                    <div className="p-2.5 bg-natural-green-light/40 border border-natural-green/20 rounded-xl text-xs flex justify-between items-start group">
                      <span className="text-natural-dark font-medium line-clamp-2">{dMeal.recipeName}</span>
                      <button
                        id={`btn-del-${dayPlan.day}-Dinner`}
                        onClick={() => deleteSlot(dayPlan.day, 'Dinner')}
                        className="text-natural-light-muted hover:text-red-500 transition ml-2 mt-0.5 opacity-10 md:opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`btn-add-${dayPlan.day}-Dinner`}
                      onClick={() => setSlotSelector({ day: dayPlan.day, type: 'Dinner' })}
                      className="w-full dashed-border hover:bg-natural-light-bg text-[11px] text-natural-muted p-2 rounded-xl text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-natural-green" /> Assign meal
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Select Recipe Overlaid modal */}
      {slotSelector && (
        <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="assign-meal-modal">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col border border-natural-border">
            <div className="border-b border-natural-border pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-md font-bold text-natural-dark font-sans">
                  Choose meal for {slotSelector.day} {slotSelector.type}
                </h3>
                <p className="text-natural-muted text-xs font-sans">
                  Select a recipe from your library to schedule.
                </p>
              </div>
              <button
                id="btn-close-assign-modal"
                onClick={() => setSlotSelector(null)}
                className="text-natural-light-muted hover:text-natural-green font-bold font-mono text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {availableRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  id={`btn-meal-option-${recipe.id}`}
                  onClick={() => selectRecipeForSlot(recipe)}
                  className="w-full text-left p-3.5 rounded-2xl border border-natural-border hover:border-natural-green/45 hover:bg-natural-green-light/45 transition flex justify-between items-center group cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="font-sans font-bold text-xs text-natural-dark line-clamp-1 group-hover:text-natural-green">
                      {recipe.title}
                    </span>
                    <span className="text-[10px] font-mono text-natural-muted bg-natural-soft-bg px-2 py-0.5 rounded mr-1">
                      {recipe.cuisine}
                    </span>
                    <span className="text-[10px] font-mono text-natural-green bg-natural-green-light px-2 py-0.5 rounded font-bold border border-natural-green/10">
                      Cost/Serving: ${recipe.costPerServing.toFixed(2)}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-natural-light-muted group-hover:text-natural-green transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Aggregated missing Groceries optimizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Shopping checkout lists */}
        <div className="md:col-span-2 bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-natural-border pb-3">
            <h4 className="text-sm font-bold text-natural-dark flex items-center gap-2 font-sans">
              <ShoppingBag className="w-4.5 h-4.5 text-natural-green animate-pulse" />
              Consolidated Missing Ingredients Shopping Checklist
            </h4>
            <span className="text-xs font-mono bg-natural-soft-bg text-natural-dark px-2.5 py-0.5 rounded-full font-bold border border-natural-border">
              {missingChecklist.length} Items Missing
            </span>
          </div>

          {missingChecklist.length === 0 ? (
            <div className="text-center py-10 text-natural-muted font-sans text-xs">
              All dishes planned are fully matched! No missing ingredients. Zero shopping footprint! 🌱
            </div>
          ) : (
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {missingChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-natural-light-bg hover:bg-natural-soft-bg rounded-xl text-xs transition">
                  <div className="flex items-center gap-2.5">
                    <div className="text-natural-light-muted flex justify-center items-center">
                      <Square className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-natural-dark font-sans">{item.name}</strong>
                      <span className="text-[9px] font-mono block text-natural-muted leading-relaxed">
                        Required for: {item.recipeSources.join(', ')}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-natural-green font-bold">
                    +${item.estimateCost.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Affiliate Fill Checkout Area */}
        <div className="bg-natural-dark text-white rounded-3xl p-6 border border-natural-dark-hover flex flex-col justify-between shadow-md">
          <div className="space-y-3">
            <span className="text-[9px] font-mono text-natural-green-light bg-white/10 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider block w-fit">
              Affiliate Grocery Optimization
            </span>
            <div className="space-y-1">
              <span className="text-[10px] font-sans text-natural-[#FCFAF7]/95 opacity-75 block uppercase font-bold tracking-wider">EXPENDITURE METRICS</span>
              <div className="text-3xl font-mono text-white font-extrabold flex items-baseline">
                ${totalGroceryCost.toFixed(2)}
                <span className="text-xs text-white/70 font-normal ml-1.5 font-sans">estimated gap cost</span>
              </div>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed font-sans">
              Partner networks bridge missing ingredients in your planned cooking cycle with zero food-waste markup! Fill your external basket with 1 click.
            </p>
          </div>

          <div className="space-y-2 pt-6 font-sans">
            <button
              id="btn-instacart-checkout"
              disabled={missingChecklist.length === 0}
              onClick={() => simulateCheckout('Instacart')}
              className="w-full text-center py-3 bg-natural-green hover:bg-natural-green-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-medium text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              🚀 Fill Instacart Bag
            </button>
            <button
              id="btn-amazon-checkout"
              disabled={missingChecklist.length === 0}
              onClick={() => simulateCheckout('AmazonFresh')}
              className="w-full text-center py-3 bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            >
              📦 Fill Amazon Fresh Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
