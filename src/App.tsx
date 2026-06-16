/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Ingredient, Recipe } from './types';
import DashboardPantry from './components/DashboardPantry';
import RecipeSection from './components/RecipeSection';
import MealPlanner from './components/MealPlanner';
import LeftoverGenius from './components/LeftoverGenius';
import ViralGrowthChallenges from './components/ViralGrowthChallenges';
import PitchPRD from './components/PitchPRD';
import TechSpecs from './components/TechSpecs';
import { ChefHat, BookOpen, Database, Flame, Sparkles, Award, CreditCard, Layers, Tag } from 'lucide-react';

export default function App() {
  // Top-level Global Tabs: app | blueprint | pitch
  const [activeTab, setActiveTab] = useState<'app' | 'pitch' | 'tech'>('app');

  // Sub tabs for the core AI Kitchen app workspace
  const [appSubTab, setAppSubTab] = useState<'pantry' | 'recipes' | 'leftovers' | 'planner' | 'growth' | 'pricing'>('pantry');

  // Shared React State Inventory
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "p1", name: "Fresh Vine Tomatoes", category: "Vegetables", quantity: "3 pcs", expiryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], daysLeft: 3, addedAt: new Date().toISOString().split('T')[0], status: "warning" },
    { id: "p2", name: "Shredded Mozzarella Cheese", category: "Dairy", quantity: "200g", expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], daysLeft: 2, addedAt: new Date().toISOString().split('T')[0], status: "warning" },
    { id: "p3", name: "Whole Milk", category: "Dairy", quantity: "500ml", expiryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], daysLeft: 5, addedAt: new Date().toISOString().split('T')[0], status: "fresh" },
    { id: "p4", name: "Sweet Bell Pepper Mix", category: "Vegetables", quantity: "2 pcs", expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], daysLeft: 7, addedAt: new Date().toISOString().split('T')[0], status: "fresh" },
    { id: "p5", name: "Baby Leaf Spinach", category: "Vegetables", quantity: "150g", expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], daysLeft: 1, addedAt: new Date().toISOString().split('T')[0], status: "warning" }
  ]);

  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [isRecipesMocked, setIsRecipesMocked] = useState(false);

  const [leftoverRecipes, setLeftoverRecipes] = useState<Recipe[]>([]);
  const [isGeneratingLeftovers, setIsGeneratingLeftovers] = useState(false);

  // Trigger recipe generation by calling backend API
  const handleRecipeGeneration = async (selected: string[], cuisine: string, diet: string, maxCost: number) => {
    setIsGeneratingRecipes(true);
    setAppSubTab('recipes'); // Auto jump to results tab
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: selected, cuisine, diet, maxCost })
      });
      const data = await response.json();
      if (data.recipes) {
        setGeneratedRecipes(data.recipes);
        setIsRecipesMocked(!!data.isMocked);
      }
    } catch (err) {
      console.error("[APP] Recipe compilation error:", err);
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  // Trigger Leftovers transformation call
  const handleLeftoverTransformation = async (leftovers: string[], diet: string) => {
    setIsGeneratingLeftovers(true);
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: leftovers, diet, isLeftoverCombo: true })
      });
      const data = await response.json();
      if (data.recipes) {
        setLeftoverRecipes(data.recipes);
      }
    } catch (err) {
      console.error("[APP] Leftovers transformation failure:", err);
    } finally {
      setIsGeneratingLeftovers(false);
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col justify-between font-sans" id="applet-viewport">
      
      {/* 1. BRAND GLOBAL TOP NAVBAR HEADER */}
      <header className="bg-white border-b border-natural-border sticky top-0 z-40 shadow-xs" id="applet-global-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-natural-green flex items-center justify-center text-white shadow-md shadow-natural-green/20">
              <ChefHat className="w-5.5 h-5.5 animate-pulse" />
            </span>
            <div>
              <h1 className="font-sans font-extrabold text-lg text-natural-dark tracking-tight leading-none uppercase flex items-center gap-1">
                Cook With What You Have
              </h1>
              <p className="text-natural-muted text-[11px] font-sans font-medium">
                AI Chef • Zero-Waste Pantry • Bento Planner
              </p>
            </div>
          </div>

          {/* Golden Global Top Level Navigation Tab Switcher */}
          <nav className="flex bg-natural-light-bg p-1 rounded-full border border-natural-border max-w-full overflow-x-auto">
            <button
              id="btn-nav-app"
              onClick={() => setActiveTab('app')}
              className={`px-5 py-2 rounded-full font-bold text-xs transition duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'app'
                  ? 'bg-natural-green text-white shadow-xs'
                  : 'text-natural-muted hover:text-natural-dark'
              }`}
            >
              🍳 AI Kitchen Platform
            </button>
            <button
              id="btn-nav-pitch"
              onClick={() => setActiveTab('pitch')}
              className={`px-5 py-2 rounded-full font-bold text-xs transition duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'pitch'
                  ? 'bg-natural-green text-white shadow-xs'
                  : 'text-natural-muted hover:text-natural-dark'
              }`}
            >
              📈 Startup Pitch & PRD
            </button>
            <button
              id="btn-nav-tech"
              onClick={() => setActiveTab('tech')}
              className={`px-5 py-2 rounded-full font-bold text-xs transition duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'tech'
                  ? 'bg-natural-green text-white shadow-xs'
                  : 'text-natural-muted hover:text-natural-dark'
              }`}
            >
              ⚙️ Technical blueprints
            </button>
          </nav>

          {/* Quick streak and details */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-natural-green-light border border-natural-green/20 rounded-full px-3 py-1 text-xs text-natural-green font-bold font-mono">
              <Flame className="w-3.5 h-3.5 text-natural-green animate-pulse fill-current" />
              <span>5 DAY STREAK</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-natural-light-bg flex items-center justify-center font-mono text-xs font-bold text-natural-muted border border-natural-border">
              HC
            </div>
          </div>

        </div>
      </header>

      {/* 2. CHOSEN WORKSPACE CANVAS BODY */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-1 w-full" id="applet-main-canvas">
        
        {/* TABS 1: CORE APP PLATFORM */}
        {activeTab === 'app' && (
          <div className="space-y-6" id="app-platform-dashboard">
            
            {/* Desktop Kitchen Rails selector */}
            <div className="flex bg-white border border-natural-border rounded-2xl p-2 items-center overflow-x-auto justify-start md:justify-center gap-1 shadow-xs max-w-full">
              {[
                { id: 'pantry', name: '📦 Pantry & Scanner', icon: Layers },
                { id: 'recipes', name: '🍳 AI Recipe Matcher', icon: Sparkles },
                { id: 'leftovers', name: '✨ Leftover Genius', icon: ChefHat },
                { id: 'planner', name: '📅 Bento Meal Planner', icon: Layers },
                { id: 'growth', name: '🏆 Streaks & Shares', icon: Award },
                { id: 'pricing', name: '💎 Premium Pro pricing', icon: CreditCard }
              ].map((sub) => {
                const Icon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    id={`btn-appsub-${sub.id}`}
                    onClick={() => setAppSubTab(sub.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                      appSubTab === sub.id
                        ? 'bg-natural-green-light text-natural-green border border-natural-green/20 font-extrabold'
                        : 'text-natural-muted hover:bg-natural-light-bg border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.8 h-3.8 shrink-0" />
                    {sub.name}
                  </button>
                );
              })}
            </div>

            {/* Render view segments */}
            <div className="transition duration-300">
              {appSubTab === 'pantry' && (
                <div id="segment-pantry">
                  <DashboardPantry
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    onAutoAdd={() => setAppSubTab('pantry')}
                  />
                </div>
              )}

              {appSubTab === 'recipes' && (
                <div id="segment-recipes">
                  <RecipeSection
                    pantryItems={ingredients}
                    recipes={generatedRecipes}
                    onGenerate={handleRecipeGeneration}
                    isGenerating={isGeneratingRecipes}
                    isMocked={isRecipesMocked}
                  />
                </div>
              )}

              {appSubTab === 'leftovers' && (
                <div id="segment-leftovers">
                  <LeftoverGenius
                    onGenerateLeftoverRecipe={handleLeftoverTransformation}
                    isGeneratingLeftover={isGeneratingLeftovers}
                    leftoverRecipes={leftoverRecipes}
                  />
                </div>
              )}

              {appSubTab === 'planner' && (
                <div id="segment-planner">
                  <MealPlanner customRecipes={generatedRecipes} />
                </div>
              )}

              {appSubTab === 'growth' && (
                <div id="segment-growth">
                  <ViralGrowthChallenges />
                </div>
              )}

              {appSubTab === 'pricing' && (
                <div className="max-w-4xl mx-auto space-y-6" id="segment-pricing border-natural-border">
                  <div className="text-center space-y-2 max-w-lg mx-auto">
                    <h2 className="text-xl font-extrabold text-[#2D2A26]">SaaS Freemium Monetization Store</h2>
                    <p className="text-natural-muted text-xs">
                      Unlock limits and integrate region grocery chains for high-volume family dining.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Free */}
                    <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono bg-natural-soft-bg text-natural-muted px-2 py-0.5 rounded font-bold uppercase">Basic Entry</span>
                        <h4 className="text-md font-bold text-natural-dark">Household Rescue</h4>
                        <div className="text-2xl font-bold text-[#2D2A26] font-mono">$0<span className="text-xs text-natural-muted font-normal">/forever</span></div>
                        <ul className="space-y-1.5 text-xs text-natural-text">
                          <li>✓ 10 Manual Pantry catalog lines</li>
                          <li>✓ 3 Vision scan per month</li>
                          <li>✓ Basic AI Recipe matches</li>
                        </ul>
                      </div>
                      <button className="w-full text-center py-2 border border-natural-border hover:bg-natural-light-bg text-natural-text rounded-xl text-xs font-bold transition mt-6">
                        Active Plan
                      </button>
                    </div>

                    {/* Pro */}
                    <div className="bg-natural-green-light border-2 border-natural-green rounded-3xl p-6 shadow-sm flex flex-col justify-between relative">
                      <span className="absolute top-4 right-4 bg-natural-green text-white text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase leading-none">Best Value</span>
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-natural-green font-bold uppercase">Infinite cooking</span>
                        <h4 className="text-md font-extrabold text-natural-dark">AI Chef Pro</h4>
                        <div className="text-2xl font-bold text-natural-green font-mono">$9.99<span className="text-xs text-natural-muted font-normal">/month</span></div>
                        <ul className="space-y-1.5 text-xs text-[#2D2A26]">
                          <li>✓ <strong>Unlimited Fridge scanner scans</strong></li>
                          <li>✓ Infinite custom bento schedules</li>
                          <li>✓ Active <strong>Voice Chef Coach assistants</strong></li>
                          <li>✓ Auto scaling & child adjustments</li>
                        </ul>
                      </div>
                      <button className="w-full text-center py-2.5 bg-natural-green hover:bg-natural-green-hover text-white rounded-xl text-xs font-bold transition mt-6 shadow-xs">
                        Upgrade Option (7-Day Trial)
                      </button>
                    </div>

                    {/* Restaurant */}
                    <div className="bg-natural-dark text-[#FCFAF7] border border-[#FCFAF7]/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono bg-white/10 text-natural-green px-2 py-0.5 rounded font-bold uppercase">Commercial</span>
                        <h4 className="text-md font-bold text-[#FCFAF7]">Leftovers Genius B2B</h4>
                        <div className="text-2xl font-bold text-white font-mono">Custom<span className="text-xs text-natural-muted font-normal">/partnerships</span></div>
                        <ul className="space-y-1.5 text-xs text-white/85">
                          <li>✓ Local municipal waste offset ledgers</li>
                          <li>✓ Sponsored ingredient bidding portals</li>
                          <li>✓ Direct integration API pipeline</li>
                        </ul>
                      </div>
                      <button className="w-full text-center py-2 bg-white/10 hover:bg-white/20 text-[#FCFAF7] rounded-xl text-xs font-bold transition mt-6 border border-white/10">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TABS 2: BLUEPRINTS / PITCH MATERIAL */}
        {activeTab === 'pitch' && (
          <div id="segment-pitch-blueprints">
            <PitchPRD />
          </div>
        )}

        {/* TABS 3: TECH SPECS OR DATA SCHEMAS */}
        {activeTab === 'tech' && (
          <div id="segment-tech-specs">
            <TechSpecs />
          </div>
        )}

      </main>

      {/* 3. PLATFORM FOOTER */}
      <footer className="bg-white border-t border-natural-border py-6" id="applet-global-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-natural-muted font-sans animate-fade-in">
          <div className="flex items-center gap-2">
            <strong className="text-natural-dark">Cook With What You Have</strong>
            <span>•</span>
            <span>Food rescue SaaS matching ecosystem</span>
          </div>
          <div className="flex gap-4">
            <span>© 2026 Cook With What You Have Inc.</span>
            <span>•</span>
            <span className="bg-natural-green-light text-natural-green px-2.5 py-0.5 rounded border border-natural-green/20 font-mono font-bold">100% Waste Rescued</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
