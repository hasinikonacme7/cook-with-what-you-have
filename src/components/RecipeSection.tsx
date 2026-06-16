/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Recipe, Ingredient } from '../types';
import { ChefHat, Sparkles, Clock, AlertCircle, PlayCircle, Star, Scale, ThumbsUp, Volume2, PauseCircle, ChevronRight, Check, RefreshCw } from 'lucide-react';

interface RecipeSectionProps {
  pantryItems: Ingredient[];
  recipes: Recipe[];
  onGenerate: (selectedIngredients: string[], cuisine: string, diet: string, maxCost: number) => Promise<void>;
  isGenerating: boolean;
  isMocked: boolean;
}

export default function RecipeSection({ pantryItems, recipes, onGenerate, isGenerating, isMocked }: RecipeSectionProps) {
  const [selectedPantryNames, setSelectedPantryNames] = useState<string[]>([]);
  const [cuisineFilter, setCuisineFilter] = useState('Any');
  const [dietFilter, setDietFilter] = useState('Any');
  const [maxCostSlider, setMaxCostSlider] = useState(10);
  const [activeDetailRecipe, setActiveDetailRecipe] = useState<Recipe | null>(null);

  // Voice Chef simulator states
  const [activeSpeechStep, setActiveSpeechStep] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakProgressText, setSpeakProgressText] = useState('');

  // Toggle item in selected list
  const togglePantrySelection = (name: string) => {
    setSelectedPantryNames(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const handleSelectAll = () => {
    setSelectedPantryNames(pantryItems.map(item => item.name));
  };

  const handleClearAll = () => {
    setSelectedPantryNames([]);
  };

  const submitRecipeRequest = () => {
    onGenerate(selectedPantryNames, cuisineFilter, dietFilter, maxCostSlider);
  };

  // Simulated Voice Chef hands-free audio narrator
  const playSpeechStep = (stepText: string, stepIdx: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(stepText);
      utterance.rate = 1.05;
      utterance.pitch = 1.1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setActiveSpeechStep(stepIdx);
        setSpeakProgressText(`"Voice Chef reading Step ${stepIdx + 1}..."`);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakProgressText('');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Audio fallback simulation inside UI if API restricted in browser frame
      setIsSpeaking(true);
      setActiveSpeechStep(stepIdx);
      setSpeakProgressText(`"Simulating Voice Chef Reading: ${stepText.slice(0, 45)}..."`);
      setTimeout(() => {
        setIsSpeaking(false);
        setSpeakProgressText('');
      }, 4000);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakProgressText('');
    setActiveSpeechStep(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="ai-recipe-engine-view">
      
      {/* LEFT COLUMN: Controls formulation */}
      <div className="space-y-6">
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4 font-sans">
          <div className="border-b border-natural-border pb-2">
            <h3 className="font-bold text-xs text-natural-dark uppercase">
              1. Choose ingredients to cook with
            </h3>
          </div>

          {pantryItems.length === 0 ? (
            <div className="text-center py-8 text-natural-muted text-xs space-y-2">
              <p>No ingredients available in your pantry catalog.</p>
              <p className="text-[10px] italic">Go back to Pantry & Scanner to restock your storage cabinets!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <button
                  id="btn-pantry-select-all"
                  onClick={handleSelectAll}
                  className="text-natural-green hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <button
                  id="btn-pantry-select-clear"
                  onClick={handleClearAll}
                  className="text-natural-light-muted hover:underline cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>

              {/* Scrolling pantry selector checks */}
              <div className="max-h-[190px] overflow-y-auto space-y-2 pr-1 text-xs">
                {pantryItems.map((item) => {
                  const isChecked = selectedPantryNames.includes(item.name);
                  return (
                    <button
                      key={item.id}
                      id={`btn-select-ingredient-${item.name.replace(/\s+/g, '-')}`}
                      onClick={() => togglePantrySelection(item.name)}
                      className={`w-full text-left p-2.5 rounded-xl border transition flex items-center gap-2.5 cursor-pointer ${
                        isChecked
                          ? 'bg-natural-green-light border-natural-green text-natural-dark font-medium'
                          : 'bg-natural-light-bg border-natural-border text-natural-text'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-natural-border text-natural-green focus:ring-0 cursor-pointer w-4 h-4 accent-natural-green"
                      />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="truncate">{item.name}</span>
                        <span className="text-[10px] text-natural-muted font-mono">
                          {item.daysLeft}d left
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* REFINEMENTS OPTIONS: Cuisine, Diet, Budget slider */}
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-natural-border pb-2">
            <h3 className="font-bold text-xs text-natural-dark uppercase">
              2. Refine dietary filters & style
            </h3>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {/* Cuisine */}
            <div className="space-y-1">
              <label className="text-natural-muted font-medium text-[10px]">Cuisine style</label>
              <select
                id="cuisine-diet-selector"
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                className="w-full p-2 border border-natural-border bg-white rounded-xl focus:border-natural-green/45 focus:outline-none"
              >
                <option value="Any">Any Culinary Style</option>
                <option value="Indian">Indian Curries & Spiced</option>
                <option value="Italian">Italian Bistro & Pastas</option>
                <option value="Chinese">Chinese Stir-Fry & Rice</option>
                <option value="Mexican">Mexican Street & Queso</option>
                <option value="Family Meals">Family Plates</option>
              </select>
            </div>

            {/* Diet lifestyle */}
            <div className="space-y-1">
              <label className="text-natural-muted font-medium text-[10px]">Dietary restriction</label>
              <select
                id="dietary-filter-selector"
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
                className="w-full p-2 border border-natural-border bg-white rounded-xl focus:border-natural-green/45 focus:outline-none"
              >
                <option value="Any">No Restrictions</option>
                <option value="Vegan">Vegan (Plant-Based)</option>
                <option value="Vegetarian">Vegetarian (Dairy Ends ok)</option>
                <option value="Keto">Keto (Low Carbs)</option>
                <option value="High Protein">High Protein</option>
                <option value="Gluten-Free">Gluten-Free (Surplus Rice)</option>
                <option value="Budget Meals">Frugal (Maximum Yield)</option>
              </select>
            </div>

            {/* Budget constraints */}
            <div className="space-y-1 pb-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-natural-muted">Max Cost/Serving</span>
                <strong className="text-natural-dark font-mono font-bold">${maxCostSlider.toFixed(2)}</strong>
              </div>
              <input
                type="range"
                min="2.0"
                max="15.0"
                step="0.5"
                id="budget-cost-slider"
                value={maxCostSlider}
                onChange={(e) => setMaxCostSlider(parseFloat(e.target.value))}
                className="w-full accent-natural-green cursor-pointer mt-1"
              />
              <span className="text-[10px] text-natural-light-muted block italic leading-none">
                Filters out items demanding expensive additions.
              </span>
            </div>

            <button
              id="btn-generate-ai-recipes"
              onClick={submitRecipeRequest}
              disabled={isGenerating || selectedPantryNames.length === 0}
              className="w-full text-center py-3 bg-natural-green hover:bg-natural-green-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold font-sans text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating AI Recipes...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  Generate AI Recipes ({selectedPantryNames.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT 2 COLUMNS: Generated catalog results */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-natural-border pb-3">
            <div>
              <h3 className="font-bold font-sans text-md text-natural-dark flex items-center gap-1.5">
                <ChefHat className="w-5 h-5 text-natural-green" />
                Zero-Waste Recipe Matches ({recipes.length})
              </h3>
              <p className="text-natural-muted text-xs">
                AI custom tailors instructions to maximize utilization of your near-expiry ingredients.
              </p>
            </div>
            {isMocked && recipes.length > 0 && (
              <span className="text-[10px] font-mono text-natural-green bg-natural-green-light px-2 py-0.5 rounded border border-natural-green/20 font-bold">
                Smart Offline Sandbox mode active
              </span>
            )}
          </div>

          {isGenerating ? (
            <div className="text-center py-20 space-y-4" id="recipes-generating-card">
              <Sparkles className="w-12 h-12 text-natural-green animate-spin mx-auto" />
              <div className="space-y-1 font-sans">
                <h4 className="font-extrabold text-natural-dark text-sm animate-pulse">Consulting the AI Chef Pro...</h4>
                <p className="text-natural-muted text-xs max-w-sm mx-auto leading-relaxed">
                  Parsing chemical properties, mapping missing items, pricing nutrition limits, and compiling step direction maps...
                </p>
              </div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-16 space-y-3 font-sans" id="empty-recipes-canvas">
              <ChefHat className="w-12 h-12 text-natural-light-muted mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-natural-dark text-sm">No recipes requested or generated yet.</h4>
                <p className="text-natural-muted text-xs max-w-sm mx-auto">
                  Pick at least 1 ingredient on the left sidebar and click 'Generate AI Recipes' to run the recipe compiler!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  id={`recipe-card-${recipe.id}`}
                  className="bg-natural-light-bg border border-natural-border hover:border-natural-green/40 rounded-2xl p-5 hover:bg-natural-green-light/40 transition-all duration-350 shadow-xs flex flex-col justify-between font-sans"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <span className="text-[9px] font-mono bg-natural-soft-bg text-[#2D2A26] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-natural-border">
                        {recipe.cuisine}
                      </span>
                      <span className="text-[10px] font-bold text-natural-green bg-natural-green-light px-2.5 py-0.5 rounded-full border border-natural-green/15">
                        ♻️ {recipe.sustainabilityScore}% Waste reduction
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-sans font-extrabold text-sm text-natural-dark">
                        {recipe.title}
                      </h4>
                      <p className="text-natural-text text-xs line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>

                    {/* Meta stats */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-mono text-natural-muted border-t border-b border-natural-border py-2">
                      <span>⏱️ Cook: <strong>{recipe.prepTime + recipe.cookTime}m</strong></span>
                      <span>💪 Diet: <strong>{recipe.difficulty}</strong></span>
                      <span>⚡ Cal: <strong>{recipe.calories} kcal</strong></span>
                    </div>

                    {/* Missing item warning indicator */}
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold font-mono text-natural-light-muted block uppercase">Missing requirements ({recipe.ingredientsMissing.length})</span>
                      {recipe.ingredientsMissing.length === 0 ? (
                        <span className="text-[10px] font-mono text-natural-green">Perfect 100% Match! No missing ingredients.</span>
                      ) : (
                        <p className="text-[10px] text-red-700 leading-relaxed truncate">
                          Needs: {recipe.ingredientsMissing.map(m => m.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-natural-border mt-4">
                    <span className="text-xs text-natural-dark">
                      Cost: <strong className="font-mono text-natural-green">${recipe.costPerServing.toFixed(2)}</strong>/svg
                    </span>
                    <button
                      id={`btn-view-recipe-${recipe.id}`}
                      onClick={() => {
                        setActiveDetailRecipe(recipe);
                        stopSpeech();
                      }}
                      className="px-4 py-1.5 bg-white border border-natural-border text-natural-dark hover:bg-natural-light-bg hover:text-natural-green font-sans font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      View Method →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>      {/* FULL RECIPE DETAIL OVERLAY VIEWPORT MODAL */}
      {activeDetailRecipe && (
        <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="recipe-detail-overlay">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col font-sans border border-natural-border">
            {/* Header branding block */}
            <div className="bg-natural-green text-white p-5 md:p-6 relative flex justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="flex gap-2 items-center text-[10px] font-mono">
                  <span className="bg-natural-green-hover text-[#FCFAF7] px-2 py-0.5 rounded font-extrabold uppercase">
                    {activeDetailRecipe.cuisine}
                  </span>
                  <span>•</span>
                  <span className="bg-natural-green-hover text-[#FCFAF7] px-2 py-0.5 rounded font-bold">
                    ♻️ {activeDetailRecipe.sustainabilityScore}% Waste Avoidance
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight">
                  {activeDetailRecipe.title}
                </h3>
                <p className="text-[#FCFAF7]/90 text-xs leading-relaxed max-w-xl">
                  {activeDetailRecipe.description}
                </p>
              </div>

              <button
                id="btn-close-recipe-overlay"
                onClick={() => {
                  setActiveDetailRecipe(null);
                  stopSpeech();
                }}
                className="text-white hover:text-natural-green-light font-bold font-mono text-xs bg-natural-green-hover p-2 w-8 h-8 flex items-center justify-center rounded-full leading-none transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable details sections */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Hands-Free Voice Chef Assistant Simulator Box */}
              <div className="bg-natural-green-light/40 border border-natural-green/20 rounded-2xl p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-natural-dark flex items-center gap-1.5 uppercase tracking-wide">
                    <Volume2 className="w-4 h-4 text-natural-green" />
                    Hands-Free Voice Chef Active Ingest Assistant
                  </h4>
                  {isSpeaking && (
                    <button
                      id="btn-voice-stop"
                      onClick={stopSpeech}
                      className="text-[10px] font-mono text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <PauseCircle className="w-3.5 h-3.5" /> Stop Reading
                    </button>
                  )}
                </div>
                <p className="text-natural-text text-xs leading-relaxed">
                  Got messy baking hands? Click the speaker button next to any step below. The Hands-Free Voice Chef reads directions out loud using audio-visual step feedback.
                </p>
                {speakProgressText && (
                  <div className="p-2 bg-white/75 border border-natural-green/20 rounded-xl text-[10px] text-natural-green font-mono italic animate-pulse">
                    {speakProgressText}
                  </div>
                )}
              </div>

              {/* Meta stats grids */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-natural-light-bg rounded-xl border border-natural-border text-center">
                  <span className="text-[9px] font-mono text-natural-muted block uppercase">Prep & Cook</span>
                  <span className="text-xs font-bold font-mono text-natural-dark">⏱️ {activeDetailRecipe.prepTime + activeDetailRecipe.cookTime} m</span>
                </div>
                <div className="p-3 bg-natural-light-bg rounded-xl border border-natural-border text-center">
                  <span className="text-[9px] font-mono text-natural-muted block uppercase">Servings</span>
                  <span className="text-xs font-bold font-mono text-natural-dark">👥 {activeDetailRecipe.servings} Servs</span>
                </div>
                <div className="p-3 bg-natural-light-bg rounded-xl border border-natural-border text-center">
                  <span className="text-[9px] font-mono text-natural-muted block uppercase">Cost/Serving</span>
                  <span className="text-xs font-bold font-mono text-natural-green">${activeDetailRecipe.costPerServing.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-natural-light-bg rounded-xl border border-natural-border text-center">
                  <span className="text-[9px] font-mono text-natural-muted block uppercase">Nutritional Density</span>
                  <span className="text-[9px] font-bold font-mono text-natural-dark block truncate">Proteins: {activeDetailRecipe.protein}</span>
                  <span className="text-[9px] font-bold font-mono text-natural-dark block truncate">Carbs: {activeDetailRecipe.carbs}</span>
                </div>
              </div>

              {/* Ingredients checks */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold text-natural-dark uppercase tracking-wider">Required Ingredients</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {/* Used items */}
                  {activeDetailRecipe.ingredientsUsed.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-natural-dark p-2 bg-natural-green-light/40 border border-natural-green/20 rounded-xl">
                      <span className="w-4 h-4 rounded-full bg-natural-green text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                      <span className="font-medium">Using: {item}</span>
                    </div>
                  ))}
                  {/* Missing items */}
                  {activeDetailRecipe.ingredientsMissing.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-red-800 p-2 bg-[#FCF8F5] border border-red-150 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <div>
                        <span className="font-medium">Missing: {item.name}</span>
                        <strong className="text-[9px] ml-1.5 font-mono text-red-900">(Est. +${item.estimateCost.toFixed(2)})</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions list with speech synthesizers */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-natural-dark uppercase tracking-wider">Step-by-Step Cooking Directions</h4>
                <div className="space-y-3 font-sans text-xs">
                  {activeDetailRecipe.instructions.map((step, idx) => {
                    const isReadingThis = activeSpeechStep === idx && isSpeaking;
                    return (
                      <div
                        key={idx}
                        id={`step-container-${idx}`}
                        className={`p-3.5 border rounded-2xl flex gap-3 items-start transition duration-250 ${
                          isReadingThis
                            ? 'bg-natural-green-light border-natural-green ring-2 ring-natural-green/20'
                            : 'bg-natural-light-bg border-natural-border hover:bg-natural-soft-bg'
                        }`}
                      >
                        <span className="font-mono font-bold text-natural-dark bg-natural-soft-bg w-6 h-6 rounded-lg flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        
                        <p className="text-natural-text leading-relaxed font-sans flex-1 pt-0.5">
                          {step}
                        </p>

                        <button
                          id={`btn-read-step-${idx}`}
                          onClick={() => playSpeechStep(step, idx)}
                          className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer ${
                            isReadingThis
                              ? 'text-natural-green bg-white'
                              : 'text-natural-light-muted hover:text-natural-green hover:bg-natural-soft-bg'
                          }`}
                          title="Read this step out loud"
                        >
                          <Volume2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sustainability Tips */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-natural-dark uppercase tracking-wider">Chef Sustainability & Storage Tips</h4>
                <ul className="space-y-1.5 list-disc list-inside text-natural-text text-xs leading-relaxed pl-1">
                  {activeDetailRecipe.tips.map((tip, idx) => (
                    <li key={idx} className="marker:text-natural-green font-sans">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
