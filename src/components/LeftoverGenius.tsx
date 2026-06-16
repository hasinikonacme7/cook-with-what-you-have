/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Recipe } from '../types';
import { Sparkles, Trash2, ArrowRight } from 'lucide-react';

interface LeftoverGeniusProps {
  onGenerateLeftoverRecipe: (leftovers: string[], diet: string) => Promise<void>;
  isGeneratingLeftover: boolean;
  leftoverRecipes: Recipe[];
}

export default function LeftoverGenius({ onGenerateLeftoverRecipe, isGeneratingLeftover, leftoverRecipes }: LeftoverGeniusProps) {
  const [inputText, setInputText] = useState('');
  const [leftoverList, setLeftoverList] = useState<string[]>(['Half baked chicken breast', 'Slightly dry spaghetti', 'Leftover cooked beans']);
  const [dietFilter, setDietFilter] = useState('Any');
  const [chosenRecipe, setChosenRecipe] = useState<Recipe | null>(null);

  const handleAddLeftover = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setLeftoverList(prev => [...prev, inputText.trim()]);
    setInputText('');
  };

  const handleRemoveLeftover = (idx: number) => {
    setLeftoverList(prev => prev.filter((_, i) => i !== idx));
  };

  const triggerLeftoverGenerator = () => {
    if (leftoverList.length === 0) return;
    onGenerateLeftoverRecipe(leftoverList, dietFilter);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="leftover-genius-view">
      {/* Input cabinet lists */}
      <div className="space-y-6">
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="space-y-1 font-sans">
            <h3 className="font-bold text-md text-natural-dark flex items-center gap-1.5">
              ✨ Leftover Rescue Cabinet
            </h3>
            <p className="text-natural-muted text-xs leading-normal">
              Type in random leftovers, leftover dishes, cooked grain bowls, or sauce ends. The AI will weave these into an entirely new meal.
            </p>
          </div>

          <form onSubmit={handleAddLeftover} className="flex gap-2 text-xs font-sans">
            <input
              type="text"
              id="leftover-input-text"
              placeholder="e.g. half-bowl mashed potato"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 p-2.5 border border-natural-border rounded-xl focus:border-natural-green/45 focus:outline-none bg-natural-light-bg"
            />
            <button
              id="btn-add-leftover"
              type="submit"
              className="px-4 py-2.5 bg-natural-green hover:bg-natural-green-hover text-white font-medium rounded-xl transition cursor-pointer"
            >
              Add
            </button>
          </form>

          {/* List display */}
          {leftoverList.length === 0 ? (
            <div className="text-center py-6 text-natural-muted text-xs font-sans">
              List is empty. Type a leftover scrap above!
            </div>
          ) : (
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 font-sans">
              {leftoverList.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-natural-light-bg border border-natural-border rounded-xl text-xs flex justify-between items-center">
                  <span className="text-natural-dark font-medium truncate">{item}</span>
                  <button
                    id={`btn-del-leftover-${idx}`}
                    onClick={() => handleRemoveLeftover(idx)}
                    className="text-natural-light-muted hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Dietary selection */}
          <div className="space-y-1.5 pt-2 font-sans">
            <span className="text-[10px] font-mono text-natural-muted uppercase tracking-wider block">DIETARY LIFE</span>
            <select
              id="leftover-dietary-selector"
              value={dietFilter}
              onChange={(e) => setDietFilter(e.target.value)}
              className="w-full text-xs p-2 border border-natural-border bg-white rounded-xl focus:border-natural-green/45 focus:outline-none"
            >
              <option value="Any">Adaptable (No Restrictions)</option>
              <option value="Vegan">Vegan Only</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Keto">Keto Friendly</option>
              <option value="High Protein">High Protein</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>

          <button
            id="btn-trigger-leftover-gen"
            onClick={triggerLeftoverGenerator}
            disabled={isGeneratingLeftover || leftoverList.length === 0}
            className="w-full py-3 text-xs bg-natural-dark text-[#FCFAF7] hover:bg-natural-dark-hover disabled:opacity-50 disabled:cursor-not-allowed font-sans font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isGeneratingLeftover ? (
              <span>✨ Weaving Leftover Magic...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-natural-green" /> Transform Leftovers ({leftoverList.length})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Transform display panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-natural-border pb-2 font-sans">
            <h3 className="font-bold text-md text-natural-dark flex items-center gap-1.5">
              🍳 Leftover Transformation Results ({leftoverRecipes.length})
            </h3>
            <p className="text-natural-muted text-xs">
              Leftover transformed meals prioritizes using up pre-cooked awkward scraps so they never hit the bin.
            </p>
          </div>

          {isGeneratingLeftover ? (
            <div className="text-center py-20 space-y-4">
              <Sparkles className="w-12 h-12 text-natural-green animate-spin mx-auto" />
              <div className="space-y-1 font-sans">
                <h4 className="font-extrabold text-natural-dark text-sm animate-pulse">Computing Leftover Genius combo...</h4>
                <p className="text-natural-muted text-xs max-w-sm mx-auto leading-relaxed">
                  Analyzing molecular properties of cooked fibers, matching storage temperatures, and building high-fidelity culinary solutions...
                </p>
              </div>
            </div>
          ) : leftoverRecipes.length === 0 ? (
            <div className="text-center py-16 space-y-4 font-sans border-2 border-dashed border-natural-border rounded-2xl p-6" id="empty-leftovers-canvas">
              <Sparkles className="w-10 h-10 text-natural-light-muted mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-natural-dark text-sm">Waiting for Leftovers transformation.</h4>
                <p className="text-natural-muted text-xs max-w-sm mx-auto">
                  Populate your cabinet with cooked leftovers on the left box, choose restrictions, and click 'Transform Leftovers' to run the AI compiler!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leftoverRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  id={`leftover-card-${recipe.id}`}
                  className="bg-natural-green-light/40 border border-natural-green/20 hover:border-natural-green/50 rounded-2xl p-5 hover:bg-natural-green-light/70 transition-all duration-350 flex flex-col justify-between font-sans"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <span className="text-[10px] font-mono bg-natural-green text-white px-2 py-0.5 rounded-full font-bold">
                        💫 LEFTOVER MIRACLE
                      </span>
                      <span className="text-[10px] text-natural-green bg-natural-green-light px-2.5 py-0.5 rounded-full font-bold font-mono border border-natural-green/10">
                        ♻️ {recipe.sustainabilityScore}% Rescue
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-sans font-extrabold text-sm text-natural-dark uppercase">
                        {recipe.title}
                      </h4>
                      <p className="text-natural-text text-xs line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-mono text-natural-muted border-t border-b border-natural-border py-2.5">
                      <span>⏱️ Cook: <strong>{recipe.prepTime + recipe.cookTime} min</strong></span>
                      <span>💪 Effort: <strong>{recipe.difficulty}</strong></span>
                      <span>🔥 Cal: <strong>{recipe.calories} kcal</strong></span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-natural-muted block uppercase">Rescued ingredients:</span>
                      <p className="text-natural-dark text-[10px]">
                        {recipe.ingredientsUsed.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-natural-border mt-4">
                    <span className="text-xs text-natural-dark">
                      Cost: <strong className="font-mono text-natural-green">${recipe.costPerServing.toFixed(2)}</strong>/svg
                    </span>
                    <button
                      id={`btn-view-leftover-${recipe.id}`}
                      onClick={() => setChosenRecipe(recipe)}
                      className="px-4 py-1.5 bg-white border border-natural-border text-natural-dark hover:bg-natural-light-bg hover:text-natural-green hover:border-natural-green/40 font-sans font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      View Recipe Method →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FULL LEFTOVER SPEC VIEW MODAL */}
      {chosenRecipe && (
        <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="leftover-details-overlay">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col font-sans border border-natural-border">
            <div className="bg-natural-green text-white p-5 flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-mono bg-natural-dark/20 text-white px-2 py-0.5 rounded font-extrabold uppercase">
                  Leftovers Miracle Match
                </span>
                <h3 className="text-md font-extrabold tracking-tight mt-1">{chosenRecipe.title}</h3>
              </div>
              <button
                id="btn-close-leftover-overlay"
                onClick={() => setChosenRecipe(null)}
                className="text-white hover:text-natural-green-light font-bold font-mono text-sm bg-natural-green-hover p-2 w-8 h-8 flex items-center justify-center rounded-full leading-none transition"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <p className="text-natural-text leading-relaxed italic">"{chosenRecipe.description}"</p>

              <hr className="border-natural-border" />

              <div className="space-y-1.5">
                <span className="font-bold text-natural-dark uppercase tracking-wide block">How to transform it:</span>
                <div className="space-y-2">
                  {chosenRecipe.instructions.map((step, idx) => (
                    <div key={idx} className="p-3 bg-natural-light-bg border border-natural-border rounded-xl flex gap-2.5 items-start">
                      <span className="font-mono font-bold text-natural-green">{idx + 1}</span>
                      <p className="text-natural-text leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
