/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PitchDeckSlide, DatabaseTable, ApiEndpoint } from '../types';

export const STARTUP_PITCH_SLIDES: PitchDeckSlide[] = [
  {
    title: "The Problem",
    subtitle: "Household food waste combined with high inflation has created a major household crisis.",
    bullets: [
      "The average family wastes over 30% of their edible groceries annually, costing up to $1,800/year.",
      "The daily question of 'What can I cook right now' results in high-friction takeout, expanding budgets.",
      "Global agriculture is strained, yet finished food gets dumped, contributing severely to global greenhouse emissions."
    ],
    metric: "30%",
    metricLabel: "Average Domestic Food Waste"
  },
  {
    title: "The Golden Solution",
    subtitle: "Cook With What You Have — an intelligent, effortless food conservation companion.",
    bullets: [
      "No tedious manual data entry: Snap a photo of your fridge or cabinet to automatically catalogue everything.",
      "Zero-Waste Recipe Engine: Uses advanced multimodal intelligence to instantly spin up spectacular recipes with what's available.",
      "Eco-System Integration: Automatic expiry alerts, localized recipe adaptation, and smart budget modes."
    ],
    metric: "$150/mo",
    metricLabel: "Estimated Average Family Savings"
  },
  {
    title: "Market Opportunity (TAM)",
    subtitle: "The intersection of high-growth sectors: Food-tech, AI Software, Sustainability.",
    bullets: [
      "Global Smart Kitchen & Food Management Market is projected to surpass $45 Billion by 2030.",
      "SaaS consumer subscriptions in diet, planning, and budget represent over 120M active paying nodes globally.",
      "Corporate ESG demands have opened extensive retail credits for carbon reduction food rescue technology."
    ],
    metric: "$45B",
    metricLabel: "Total Addressable Market by 2030"
  },
  {
    title: "The Product - Magical & Addictive",
    subtitle: "A modern, highly optimized multi-page responsive web experience.",
    bullets: [
      "Smart Fridge Scanner: Computer vision extracts list of items and expiry days.",
      "Zero-Glow Cook Mode: Hands-free cooking guided by interactive Voice Chef assistant.",
      "Weekly Meal Planner & Optimizer: Stagger food cards to match expirations, auto-building grocery gaps.",
      "Leftover Genius: Convert yesterdays meals into brand-new culinary masterpieces."
    ],
    metric: "4.9★",
    metricLabel: "Simulated App App-Store Rating Goal"
  },
  {
    title: "Monetization Strategy",
    subtitle: "Multi-layered high margin revenue engines designed for strong LTV.",
    bullets: [
      "AI Chef Pro ($9.99/mo): Unlimited vision scans, voice coaching, advanced macro planners, and family scaling.",
      "Grocery Affiliate Partnerships: One-click Instacart / Amazon Fresh Cart Filling to buy missing ingredients.",
      "Sponsored Ingredients: CPG brands (e.g. Barilla, Silk) sponsor high-ranking recipe matches in search lists."
    ],
    metric: "35%",
    metricLabel: "Projected Net Profit Margin"
  }
];

export const DATABASE_SCHEMA_TABLES: DatabaseTable[] = [
  {
    name: "users",
    description: "Stores core user accounts, dietary choices, and system configurations.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Unique identifier" },
      { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE NOT NULL", description: "Registered email" },
      { name: "dietary_preference", type: "VARCHAR(50)", constraints: "DEFAULT 'Any'", description: "Vegan, Keto, Vegetarian, family adaptors, etc." },
      { name: "cooking_streak", type: "INTEGER", constraints: "DEFAULT 0", description: "Consecutive active cooking days" },
      { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT NOW()", description: "Creation record" }
    ]
  },
  {
    name: "pantry_ingredients",
    description: "Tracks active ingredient inventories, estimated remaining counts, and expiration dates.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Ingredient reference key" },
      { name: "user_id", type: "UUID", constraints: "REFERENCES users(id) ON DELETE CASCADE", description: "Owner reference ID" },
      { name: "name", type: "VARCHAR(150)", constraints: "NOT NULL", description: "E.g. bell peppers, organic skimmed milk" },
      { name: "category", type: "VARCHAR(50)", description: "Proteins, Dairy, Vegetables, Fruits, Grains, etc." },
      { name: "quantity", type: "VARCHAR(50)", description: "E.g. '300g', '2 units'" },
      { name: "expiry_date", type: "DATE", constraints: "NOT NULL", description: "Projected spoilage date" },
      { name: "added_at", type: "TIMESTAMP", constraints: "DEFAULT NOW()", description: "When added or scanned" }
    ]
  },
  {
    name: "saved_recipes",
    description: "Caches AI generated recipes and user configurations of custom bento layouts.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", description: "Recipe reference ID" },
      { name: "user_id", type: "UUID", constraints: "REFERENCES users(id)", description: "Generated by user reference" },
      { name: "title", type: "VARCHAR(250)", constraints: "NOT NULL", description: "Recipe title" },
      { name: "cuisine", type: "VARCHAR(100)", description: "E.g. Italian, Fusion" },
      { name: "prep_time", type: "INTEGER", description: "Prep in minutes" },
      { name: "cook_time", type: "INTEGER", description: "Cook in minutes" },
      { name: "servings", type: "INTEGER", description: "Base servings scaling config" },
      { name: "nutrition_info", type: "JSONB", description: "Holds calories, protein, carbs, fat lists" },
      { name: "instructions", type: "TEXT[]", description: "Ordered array of cooking steps" }
    ]
  },
  {
    name: "meal_plans",
    description: "Maps specific recipes to planned slots across days of the week, with shopping checklists.",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Plan identifier" },
      { name: "user_id", type: "UUID", constraints: "REFERENCES users(id)", description: "Owner user ID" },
      { name: "day_of_week", type: "VARCHAR(20)", description: "Monday, Tuesday, etc." },
      { name: "meal_type", type: "VARCHAR(20)", description: "Breakfast, Lunch, Dinner, Snack" },
      { name: "recipe_id", type: "UUID", constraints: "REFERENCES saved_recipes(id)", description: "Recipe mapped" }
    ]
  }
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "POST",
    path: "/api/scan-fridge",
    description: "Multimodal visual ingestion service. Processes base64 photo of inside fridge/pantry, runs target vision, and returns categorized list of ingredients.",
    requestBody: "{\n  \"imageBase64\": \"data:image/jpeg;base64,/9j/4AAQSk...\"\n}",
    responseBody: "{\n  \"ingredients\": [\n    {\n      \"id\": \"scanned_tomato\",\n      \"name\": \"Fresh Vine Tomatoes\",\n      \"category\": \"Vegetables\",\n      \"quantity\": \"3 pcs\",\n      \"expiryDate\": \"2026-06-19\",\n      \"daysLeft\": 3\n    }\n  ],\n  \"isMocked\": false\n}"
  },
  {
    method: "POST",
    path: "/api/generate-recipe",
    description: "Zero-Waste cooking matches. Receives available ingredients and restrictions, calls Gemini, and builds targeted step-by-step recipes.",
    requestBody: "{\n  \"ingredients\": [\"tomatoes\", \"spinach\", \"mozzarella\"],\n  \"cuisine\": \"Italian\",\n  \"diet\": \"Gluten-Free\",\n  \"maxCost\": 5.0\n}",
    responseBody: "{\n  \"recipes\": [\n    {\n      \"id\": \"rec_982\",\n      \"title\": \"Rustico Leftover Caprese Bake\",\n      \"cuisine\": \"Italian\",\n      \"cookTime\": 15,\n      \"costPerServing\": 2.30,\n      \"protein\": \"14g\",\n      \"instructions\": [\"Preheat oven to 375F.\", \"Slice tomatoes...\"],\n      \"sustainabilityScore\": 95\n    }\n  ],\n  \"isMocked\": false\n}"
  },
  {
    method: "GET",
    path: "/api/pantry",
    description: "Retrieves the current user's authenticated kitchen inventory list, sorted by expiration countdown.",
    responseBody: "[\n  {\n    \"id\": \"pant_832\",\n    \"name\": \"Whole Milk\",\n    \"category\": \"Dairy\",\n    \"daysLeft\": 2,\n    \"status\": \"warning\"\n  }\n]"
  }
];

export const ORGANIC_GROWTH_SEO_PLAN = {
  pillars: [
    {
      title: "1. Programmatic Recipe Pages",
      content: "Auto-generate search optimized landing pages for all logical combinations of secondary foods (e.g., 'What-To-Cook-With-Leftover-Chicken-And-Spinach' or 'Leftover-Tomato-Paste-Recipes'). This captures massive long-tail search volume with zero manual editing."
    },
    {
      title: "2. The 'Expiry Rescue' Calculator Widget",
      content: "Embed a free, light interactive widget on food blogs, parenting columns, and budget forums. Allows audiences to punch in 2 items and see a live quick-recipe in 1 click, directing them to the main platform via viral referral hooks."
    },
    {
      title: "3. 'Show My Fridge' Challenge",
      content: "A viral gamified social loop. Users scan their fridge, create a beautiful visual AI Recipe Card, and post it to TikTok/Instagram with tags like #ShowMyFridge or #SalvageKitchen. Points translate directly to free Chef Pro weeks."
    }
  ],
  roadmap: [
    { phase: "Months 1-3", goal: "Launch core platform, build long-tail programmatic URL structures (10,000+ targeted keywords), seed 15 local food-waste micro-influencers." },
    { phase: "Months 4-6", goal: "Embed 'Expiry Rescue' widgets in recipe aggregators, deploy automatic recipe schema markups (JSON-LD) for rich organic search visual snippets." },
    { phase: "Months 7-12", goal: "Integrate carbon offsets tracking, partner with regional municipalities for grocery tax rebates on highly certified food-waste rescue streaks." }
  ]
};

export const LAUNCH_ROADMAP = [
  { item: "Phase 1: Founder Beta (MVP)", details: "Develop core Express backend, link client, complete manual pantry tracking and Gemini-3.5-flash recipe parser. Limit to 1,000 waitlisted home chefs." },
  { item: "Phase 2: Vision Multimodal Alpha", details: "Introduce image computer vision integration. Integrate custom camera frame scanner inside the mobile-optimized interface." },
  { item: "Phase 3: Affiliate Cart & Scale", details: "Onboard affiliate links (Instacart, Amazon Fresh) enabling 1-click addition of missing spices and pantry staples. Unlock Pro pricing models." },
  { item: "Phase 4: Public Hypergrowth", details: "Promote organic 'Show My Fridge' social badges and coordinate carbon savings reports to yield eco corporate partnerships." }
];
