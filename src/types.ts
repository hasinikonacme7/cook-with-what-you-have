/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Core App Entities

export interface Ingredient {
  id: string;
  name: string;
  category: string; // 'Vegetables', 'Proteins', 'Dairy', 'Grains', 'Pantry', etc.
  quantity: string;
  expiryDate: string; // YYYY-MM-DD
  daysLeft: number;
  addedAt: string;
  status: 'fresh' | 'warning' | 'expired';
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  costPerServing: number;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  dietTags: string[];
  ingredientsUsed: string[];
  ingredientsMissing: { name: string; estimateCost: number }[];
  instructions: string[];
  tips: string[];
  sustainabilityScore: number; // percentage of used ingredients vs waste
}

export interface MealPlanDay {
  day: string; // 'Monday', 'Tuesday', etc.
  meals: {
    id: string;
    type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    recipeId: string;
    recipeName: string;
  }[];
}

// Gamification & Viral Growth
export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  category: string;
}

export interface CookingStreak {
  currentStreak: number;
  bestStreak: number;
  history: string[]; // dates
}

export interface CommunityChallenge {
  id: string;
  title: string;
  author: string;
  likes: number;
  rating: number;
  photoUrl: string;
  ingredients: string[];
  resultRecipe: string;
}

// Deliverables Layout Structures

export interface PitchDeckSlide {
  title: string;
  subtitle?: string;
  bullets?: string[];
  metric?: string;
  metricLabel?: string;
  colorTheme?: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: string;
  responseBody: string;
}

export interface DatabaseTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints?: string;
    description: string;
  }[];
}
