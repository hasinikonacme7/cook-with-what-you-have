/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Badge, CookingStreak, CommunityChallenge } from '../types';
import { Flame, Award, Share2, Sparkles, AlertCircle, Heart, Star, Layout, RefreshCw, CheckCircle } from 'lucide-react';

export default function ViralGrowthChallenges() {
  const [streak, setStreak] = useState<CookingStreak>({
    currentStreak: 5,
    bestStreak: 12,
    history: ['2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16']
  });

  const [badges, setBadges] = useState<Badge[]>([
    { id: "b_1", name: "Food Waste Hero", description: "Successfully cook 3 recipes utilizing near-expiry ingredients.", unlocked: true, unlockedAt: "2026-06-12", icon: "🌱", category: "Eco-Metrics" },
    { id: "b_2", name: "Frugal King", description: "Plan a complete weekly bento plan keeping cost per serving under $2.50.", unlocked: true, unlockedAt: "2026-06-14", icon: "👑", category: "Budget-Metrics" },
    { id: "b_3", name: "Vision Pioneer", description: "Authenticate and run a full Smart Fridge Vision Scan.", unlocked: true, unlockedAt: "2026-06-15", icon: "👁️", category: "Vision-Metrics" },
    { id: "b_4", name: "Voice Chef Apprentice", description: "Use Voice Assistant to read cooking instructions for a full active step recipe.", unlocked: false, icon: "🗣️", category: "Voice-Metrics" },
    { id: "b_5", name: "Leftover Alchemist", description: "Convert awkwardly dry spaghetti scraps into a zesty frittata skillet.", unlocked: false, icon: "⚗️", category: "Leftover-Genius" }
  ]);

  // Social Challenge Card generator States
  const [userName, setUserName] = useState('Happy Chef');
  const [cardIngredients, setCardIngredients] = useState('wilted spinach, cheese scraps, tomato chunks');
  const [cardRecipe, setCardRecipe] = useState('Rustico leftover Caprese Soufflé');
  const [cardTheme, setCardTheme] = useState('Sunny Orange');
  const [generatedShareCard, setGeneratedShareCard] = useState<boolean>(false);

  const handleShareChallenge = () => {
    setGeneratedShareCard(true);
  };

  return (
    <div className="space-y-8 font-sans" id="viral-growth-challenges-root">
      
      {/* Top row: Streak dashboard & custom claim incentives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Streak Tracker Block */}
        <div className="bg-natural-dark border border-natural-dark-hover rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          {/* Ambient accent background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-natural-green/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-natural-green-light uppercase tracking-widest font-extrabold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-natural-green-light animate-pulse" /> Live active Hot streak
            </span>
            <div className="flex items-center gap-4">
              <span className="text-5xl md:text-6xl font-mono text-natural-green-light font-extrabold tracking-tighter">
                {streak.currentStreak}
              </span>
              <div>
                <h4 className="font-sans font-bold text-sm text-white/95">Cooking streak days!</h4>
                <p className="text-[#FCFAF7]/70 text-xs">Best ever streak: {streak.bestStreak} days</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center text-[11px] text-white/80">
            <span>Next milestone: 7s day batch</span>
            <span className="text-natural-green-light font-bold">Unlocks 'Master Chef' tag</span>
          </div>
        </div>

        {/* Milestone Achievement Badge List */}
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4 md:col-span-2">
          <div className="border-b border-natural-border pb-2">
            <h3 className="font-bold font-sans text-md text-natural-dark flex items-center gap-1.5">
              <Award className="w-5 h-5 text-natural-green" />
              Achievements Badges & Streaks
            </h3>
            <p className="text-natural-muted text-xs">
              Milestones unlocked represent real carbon footprints rescued and budgets stretched.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`p-3.5 border rounded-2xl flex flex-col justify-between gap-3 text-xs transition ${
                  badge.unlocked
                    ? 'bg-natural-green-light/40 border-natural-green/20 text-natural-dark'
                    : 'bg-natural-light-bg/50 border-natural-border text-natural-muted'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl" id={`badge-icon-${badge.id}`}>{badge.icon}</span>
                  {badge.unlocked ? (
                    <span className="text-[9px] font-mono bg-natural-green text-white px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono bg-natural-soft-bg text-natural-muted px-1.5 py-0.5 rounded font-medium uppercase shrink-0 border border-natural-border">
                      Locked
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-natural-dark">{badge.name}</h4>
                  <p className="text-natural-muted text-[10px] leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle row: Interactive #ShowMyFridge Social Card Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Builder configs */}
        <div className="lg:col-span-2 bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-bold font-sans text-md text-natural-dark flex items-center gap-1.5">
              <Share2 className="w-4.5 h-4.5 text-natural-green animate-pulse" />
              #ShowMyFridge Challenge Card Builder
            </h3>
            <p className="text-natural-text text-xs">
              We leverage word-of-mouth loops. Complete the challenge, create an aesthetic recipe card showing your food rescue scores, and post to TikTok/IG tags!
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-3 text-xs font-sans">
            <div className="space-y-1">
              <label className="text-natural-muted text-[10px]">Your Name or Handle</label>
              <input
                type="text"
                id="builder-chef-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border border-natural-border bg-white rounded-xl focus:border-natural-green/45 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-natural-muted text-[10px]">Awkward scraps rescued</label>
              <input
                type="text"
                id="builder-scraps-input"
                value={cardIngredients}
                onChange={(e) => setCardIngredients(e.target.value)}
                className="w-full p-2 border border-natural-border bg-white rounded-xl focus:border-natural-green/45 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-natural-muted text-[10px]">Transformed Recipe result name</label>
              <input
                type="text"
                id="builder-recipe-name"
                value={cardRecipe}
                onChange={(e) => setCardRecipe(e.target.value)}
                className="w-full p-2 border border-natural-border bg-white rounded-xl focus:border-natural-green/45 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-natural-muted text-[10px]">Select Card Aesthetics</label>
              <div className="grid grid-cols-3 gap-1 grid-flow-row">
                {['Sunny Orange', 'Emerald Clover', 'Noir Tech'].map((theme) => (
                  <button
                    key={theme}
                    id={`btn-theme-sel-${theme.replace(/\s+/g, '-')}`}
                    onClick={() => setCardTheme(theme)}
                    className={`p-2 rounded-xl text-[10px] text-center border font-bold cursor-pointer ${
                      cardTheme === theme
                        ? 'bg-natural-green-light border-natural-green text-natural-dark font-extrabold'
                        : 'bg-natural-soft-bg border-natural-border text-natural-muted'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="btn-generate-share-card"
              onClick={handleShareChallenge}
              className="w-full py-2.5 bg-natural-green hover:bg-natural-green-hover text-white rounded-xl font-bold transition text-xs flex items-center justify-center gap-1 mt-3 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" /> Compile Share Card!
            </button>
          </form>
        </div>

        {/* Display template block */}
        <div className="lg:col-span-3 bg-white border border-natural-border rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center relative min-h-[320px]">
          {generatedShareCard ? (
            <div className="w-full max-w-sm space-y-4">
              {/* Actual render card */}
              <div
                id="shareable-card-canvas"
                className={`w-full rounded-3xl p-6 text-white flex flex-col justify-between aspect-[4/3] shadow-xl relative overflow-hidden transition-all duration-300 ${
                  cardTheme === 'Sunny Orange'
                    ? 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-600'
                    : cardTheme === 'Emerald Clover'
                    ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700'
                    : 'bg-gradient-to-br from-stone-800 via-stone-900 to-black'
                }`}
              >
                {/* Accent visuals */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />

                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold bg-black/25 px-2.5 py-0.5 rounded-full uppercase leading-none block w-max">
                      #ShowMyFridge Challenge
                    </span>
                    <span className="text-[8px] font-mono text-zinc-200 mt-1 block">PLATFORM RECOGNITION BADGE</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-current text-white" />)}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase bg-white/20 text-white px-2 py-0.5 rounded-full">
                    ♻️ 98% ZERO-WASTE ACCREDITED
                  </span>
                  <h4 className="text-xl font-extrabold tracking-tight font-sans italic leading-tight leading-none uppercase">
                    "{cardRecipe}"
                  </h4>
                  <p className="text-[11px] text-zinc-100 line-clamp-2 italic leading-relaxed">
                    Rescued: {cardIngredients}
                  </p>
                </div>

                <div className="border-t border-white/25 pt-4 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="block font-bold">Chef: {userName}</span>
                    <span className="block text-[8px] font-mono text-zinc-300">CookWithWhatYouHave.com</span>
                  </div>
                  <div className="bg-white text-natural-dark p-2 rounded-xl text-[10px] font-extrabold font-mono flex items-center gap-1 leading-none shadow-md">
                    🏅 RATED SOURCED PRO
                  </div>
                </div>
              </div>

              {/* Instructions and tips */}
              <div className="p-3 bg-natural-green-light border border-natural-green/20 rounded-xl text-[11px] text-natural-dark flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-natural-green shrink-0 mt-0.5 animate-bounce" />
                <p className="leading-relaxed">
                  <strong>Milestone unlocked:</strong> Your card was compiled successfully! Post this graphic on your social media channels. Tag <strong>#ShowMyFridge</strong>. After 10 likes, your account automatically unlocks 1 month of <strong>AI Chef Pro</strong>!
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3 text-natural-light-muted text-xs" id="empty-share-card-canvas">
              <Layout className="w-12 h-12 text-natural-border mx-auto animate-pulse" />
              <div className="space-y-1">
                <h4 className="font-bold text-natural-dark text-sm">Challenge Share Card Preview</h4>
                <p className="max-w-[240px] mx-auto text-natural-muted leading-relaxed">
                  Fill key details in builder pane and click 'Compile Share Card' to render your aesthetic social-share certificate!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
