/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with raised limit for fridge photo uploads (base64)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy initializer for Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------- high-fidelity FALLBACK DATA generators -----------------
const MOCK_RECIPES = [
  {
    id: "rec_1",
    title: "Eco-Harvest Golden Turmeric Stir-Fry",
    description: "A gorgeous, fragrant anti-inflammatory stir-fry designed to rescue slightly wilted vegetables and combine them with simple pantry grains.",
    cuisine: "Chinese-Indian Fusion",
    difficulty: "Easy" as const,
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    costPerServing: 1.85,
    calories: 340,
    protein: "12g",
    carbs: "45g",
    fat: "8g",
    dietTags: ["Vegan", "Gluten-Free", "High Protein", "Budget Meals"],
    ingredientsUsed: ["carrots", "bell peppers", "spinach", "rice"],
    ingredientsMissing: [{ name: "firm tofu or chickpeas", estimateCost: 1.20 }],
    instructions: [
      "Prep your ingredients: wash and thinly slice carrots and bell peppers. Rinse rice and start it cooking.",
      "Heat a splash of oil in a skillet or wok over medium-high heat. Toss in sliced bell peppers and carrots, stir-frying for 4-5 minutes until bright but crisp.",
      "Stir in tumeric, minced garlic (if available), and salt. Deglaze the pan with a spoonful of water or soy sauce.",
      "Add of fresh/wilted spinach in the last minute, letting it wilt completely. Serve steaming over warm rice with a drizzle of sesame oil."
    ],
    tips: ["Save carrot tops to blend into an eco-friendly pesto!", "Any dark leafy greens like kale or chard work interchangeably here."],
    sustainabilityScore: 92
  },
  {
    id: "rec_2",
    title: "Rustico Leftover Tomato & Cheese Quesadilla",
    description: "A crisp, satisfying Mexican favorite that breathes new life into cheese ends and leftover tortilla wraps, accented by slow-caramelized onions.",
    cuisine: "Mexican",
    difficulty: "Easy" as const,
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    costPerServing: 1.45,
    calories: 420,
    protein: "18g",
    carbs: "32g",
    fat: "22g",
    dietTags: ["Vegetarian", "Family Meals", "Budget Meals"],
    ingredientsUsed: ["cheese", "tomatoes", "tortillas"],
    ingredientsMissing: [{ name: "fresh cilantro or lime", estimateCost: 0.60 }],
    instructions: [
      "Thinly slice of tomatoes and shred of whatever cheese block ends you have in your fridge.",
      "Place one tortilla wrap flat in a dry skillet over medium heat. Scatter cheese evenly across half the tortilla.",
      "Layer tomato slices on top of cheese. Fold the tortilla in half to form a half-moon shape.",
      "Sizzle for 3-4 minutes on each side, turning carefully, until the outside is golden-brown and the cheese is fully melted and stringy.",
      "Slice into wedges and serve immediately while warm."
    ],
    tips: ["Got stale chips? Crush them inside the quesadilla for a crunch factor!", "Works amazingly with cheddar, mozzarella, Swiss, or Monterey jack."],
    sustainabilityScore: 88
  },
  {
    id: "rec_3",
    title: "Pantry-Hero Garlic Herb Pasta Alfredo",
    description: "An indulgent-feeling yet incredibly frugal pasta dish using staple dairy ends and basic household pasta, whipped up in under twenty minutes.",
    cuisine: "Italian",
    difficulty: "Easy" as const,
    prepTime: 8,
    cookTime: 10,
    servings: 4,
    costPerServing: 2.10,
    calories: 520,
    protein: "15g",
    carbs: "72g",
    fat: "18g",
    dietTags: ["Vegetarian", "Family Meals"],
    ingredientsUsed: ["milk", "cheese", "pasta"],
    ingredientsMissing: [{ name: "fresh parsley", estimateCost: 0.50 }, { name: "garlic cloved", estimateCost: 0.30 }],
    instructions: [
      "Bring a large pot of salted water to a rolling boil. Drop pasta and cook to al dente (about 8-10 minutes).",
      "While pasta cooks, gently simmer milk in a small saucepan with a pinch of garlic powder or grated garlic.",
      "Slowly melt in your grated cheese ends, stirring continuously until smooth. Season with salt and cracked pepper.",
      "Drain pasta, reserving half a cup of starchy pasta water.",
      "Combine pasta and sauce in the pot, tossing vigorously. Add pasta water tablespoon by tablespoon if you need to stretch the sauce. Serve hot."
    ],
    tips: ["A spoonful of cream cheese or Greek yogurt makes this extra creamy!", "Toss in any leftover roast chicken or peas to boost protein counts."],
    sustainabilityScore: 85
  },
  {
    id: "rec_4",
    title: "Master Chef Leftover Fried Rice",
    description: "The ultimate culinary tool for food rescue. Converts old grains and any combination of storage veggies into a highly addictive savory wok dish.",
    cuisine: "Chinese",
    difficulty: "Medium" as const,
    prepTime: 10,
    cookTime: 8,
    servings: 2,
    costPerServing: 1.25,
    calories: 460,
    protein: "14g",
    carbs: "60g",
    fat: "14g",
    dietTags: ["High Protein", "Budget Meals", "Keto Friendly Adaptable"],
    ingredientsUsed: ["rice", "carrots", "spinach"],
    ingredientsMissing: [{ name: "eggs", estimateCost: 0.80 }, { name: "soy sauce", estimateCost: 0.40 }],
    instructions: [
      "Heat a large wok or deep skillet on high. Add a tablespoon of neutral frying oil.",
      "Sauté diced carrots for 2 minutes, then stir in spinach until wilted. Slide the vegetables to one side of the pan.",
      "Pour beaten egg into the cleared space and scramble until softly curdled.",
      "Dump in cold left-over rice, breaking up any clumps. Crank the heat and stir-fry everything together vigorously.",
      "Drizzle soy sauce and sesame oil over the rice, folding rapidly until every grain is glistening and heated through."
    ],
    tips: ["Using cold, day-old rice is critical to avoid soggy fried rice!", "A pinch of green onions on top adds immediate professional chef aesthetic."],
    sustainabilityScore: 98
  }
];

// Fallback visual detection lists for Smart Fridge Scanner
const DETECTED_FRIDGE_LISTS = [
  [
    { id: "1", name: "Fresh Vine Tomatoes", category: "Vegetables", quantity: "3 pcs", expiryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], daysLeft: 3, addedAt: new Date().toISOString().split('T')[0], status: "warning" as const },
    { id: "2", name: "Shredded Mozzarella Cheese", category: "Dairy", quantity: "200g", expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], daysLeft: 2, addedAt: new Date().toISOString().split('T')[0], status: "warning" as const },
    { id: "3", name: "Whole Milk", category: "Dairy", quantity: "500ml", expiryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], daysLeft: 5, addedAt: new Date().toISOString().split('T')[0], status: "fresh" as const },
    { id: "4", name: "Sweet Bell Pepper Mix", category: "Vegetables", quantity: "2 pcs", expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], daysLeft: 7, addedAt: new Date().toISOString().split('T')[0], status: "fresh" as const },
    { id: "5", name: "Baby Leaf Spinach", category: "Vegetables", quantity: "150g", expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], daysLeft: 1, addedAt: new Date().toISOString().split('T')[0], status: "warning" as const }
  ],
  [
    { id: "6", name: "Organic Carrots", category: "Vegetables", quantity: "4 pcs", expiryDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0], daysLeft: 8, addedAt: new Date().toISOString().split('T')[0], status: "fresh" as const },
    { id: "7", name: "Greek Yogurt", category: "Dairy", quantity: "400g", expiryDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], daysLeft: 4, addedAt: new Date().toISOString().split('T')[0], status: "warning" as const },
    { id: "8", name: "Boneless Chicken Breast", category: "Proteins", quantity: "400g", expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], daysLeft: 2, addedAt: new Date().toISOString().split('T')[0], status: "warning" as const },
    { id: "9", name: "Fresh Garlic Bulbs", category: "Pantry", quantity: "3 pcs", expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], daysLeft: 30, addedAt: new Date().toISOString().split('T')[0], status: "fresh" as const }
  ]
];

// ----------------- API Endpoints -----------------

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), hasGeminiApiKey: !!process.env.GEMINI_API_KEY });
});

// Recipe Generator endpoint (GEMINI integration with Mock Fallback)
app.post('/api/generate-recipe', async (req, res) => {
  const { ingredients, cuisine, diet, maxCost, isLeftoverCombo } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "At least one ingredient is required to cook with what you have." });
  }

  const ai = getAi();
  if (!ai) {
    // If no API key configured, run high-fidelity smart filtering mock
    console.log("[SERVER] Gemini API Key not configured. Using intelligent Mock Kitchen simulation...");
    const filteredRecipes = MOCK_RECIPES.map((recipe: any) => {
      // Intelligently cross-reference matching ingredients to calculate matching scores
      const matched = recipe.ingredientsUsed.filter(item => 
        ingredients.some((u: string) => u.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(u.toLowerCase()))
      );
      const matchRatio = matched.length / Math.max(1, recipe.ingredientsUsed.length);
      return { ...recipe, _matchRatio: matchRatio };
    });

    // Sort by match ratio
    filteredRecipes.sort((a: any, b: any) => b._matchRatio - a._matchRatio);

    // Filter diet tags or cuisine if matching requested
    let results = filteredRecipes;
    if (diet) {
      results = results.filter(r => r.dietTags.some(t => t.toLowerCase().includes(diet.toLowerCase())));
    }
    if (cuisine && cuisine !== "Any") {
      results = results.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
    }

    // Standardize to matching formats
    const finalRecipes = (results.length > 0 ? results : MOCK_RECIPES).map((r: any) => {
      const { _matchRatio, ...cleanR } = r;
      // Adapt recipes values if custom restrictions (Keto, Budget, Vegetarian, etc.)
      if (diet === "Keto") {
        cleanR.dietTags = [...cleanR.dietTags, "Keto Friendly"];
        cleanR.carbs = "5g";
        cleanR.fat = "28g";
      }
      if (isLeftoverCombo) {
        cleanR.title = "✨ Leftover Rescue: " + cleanR.title;
      }
      return cleanR;
    });

    return res.json({ recipes: finalRecipes, isMocked: true });
  }

  try {
    const ingredientText = ingredients.join(', ');
    const systemPrompt = `You are a world-class startup head chef, food-waste reduction advocate, and nutritional expert.
You help households cook magical, affordable, and spectacular meals with EXACTLY what ingredients they have available in their fridges or pantry.
Focus heavily on reduction of household food waste. Always provide cooking times, nutritional totals, and a Sustainability Score percentage (representing how efficiently it rescues the ingredients, e.g. 96%).`;

    // Prompt requesting structured recipes matching our Recipe interface
    const prompt = `Generate 2-3 delicious, inspiring, and fully customized recipes utilizing some or all of these primary ingredients already available: [${ingredientText}].
${cuisine && cuisine !== 'Any' ? `The user requests a "${cuisine}" cuisine style if possible.` : ''}
${diet && diet !== 'Any' ? `Adhere to this strict dietary lifestyle / health tag: "${diet}".` : ''}
${maxCost ? `Optimize the recipe to be low budget with an calculated cost-per-serving under $${maxCost}.` : ''}

For any key ingredient that is missing but absolutely necessary to tie the dish together, place it inside the "ingredientsMissing" array with an estimated budget cost in USD.
Respond in JSON format as an array containing logical recipe objects.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              description: "List of custom recipes generated from available foods",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: "Must be Easy, Medium, or Hard" },
                  prepTime: { type: Type.INTEGER, description: "in minutes" },
                  cookTime: { type: Type.INTEGER, description: "in minutes" },
                  servings: { type: Type.INTEGER },
                  costPerServing: { type: Type.NUMBER, description: "calculated cost-per-serving in USD" },
                  calories: { type: Type.INTEGER },
                  protein: { type: Type.STRING, description: "e.g. 15g" },
                  carbs: { type: Type.STRING, description: "e.g. 40g" },
                  fat: { type: Type.STRING, description: "e.g. 10g" },
                  dietTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                  ingredientsMissing: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        estimateCost: { type: Type.NUMBER }
                      },
                      required: ["name", "estimateCost"]
                    }
                  },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "detailed step by step guide" },
                  tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "sustainability or alternative prep tips" },
                  sustainabilityScore: { type: Type.INTEGER, description: "percentage from 50 to 100 based on utilizing leftovers/expiries" }
                },
                required: [
                  "id", "title", "description", "cuisine", "difficulty", "prepTime", "cookTime", 
                  "servings", "costPerServing", "calories", "protein", "carbs", "fat", "dietTags", 
                  "ingredientsUsed", "ingredientsMissing", "instructions", "tips", "sustainabilityScore"
                ]
              }
            }
          },
          required: ["recipes"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{"recipes": []}');
    return res.json({ recipes: parsedData.recipes, isMocked: false });

  } catch (error: any) {
    console.error("[SERVER] Gemini generation error:", error);
    // Graceful error propagation back with fallback
    return res.status(200).json({
      recipes: MOCK_RECIPES,
      isMocked: true,
      notice: "Live AI generation paused due to a backend error, running fully loaded smart kitchen model.",
      error: error.message
    });
  }
});

// Photo / Visual scan fridge endpoint (multimodal GEMINI or fallback)
app.post('/api/scan-fridge', async (req, res) => {
  const { imageBase64 } = req.body; // base64 string

  if (!imageBase64) {
    // Return a random set of fresh simulated items if no image provided
    const randomSet = DETECTED_FRIDGE_LISTS[Math.floor(Math.random() * DETECTED_FRIDGE_LISTS.length)];
    return res.json({ ingredients: randomSet, isMocked: true });
  }

  const ai = getAi();
  if (!ai) {
    console.log("[SERVER] Gemini API Key not configured. Simulating multimodal fridge computer vision...");
    // Simulate smart computer vision processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const randomSet = DETECTED_FRIDGE_LISTS[Math.floor(Math.random() * DETECTED_FRIDGE_LISTS.length)];
    return res.json({ ingredients: randomSet, isMocked: true });
  }

  try {
    // Process base64
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    };

    const textPrompt = `Analyze this fridge or kitchen pantry image. Detect and catalog EVERY visible ingredient inside.
For each detected ingredient, extract:
1. ingredientName: standardized clear name
2. category: must be Vegetables, Proteins, Dairy, Grains, Pantry, or Fruits
3. estimatedQty: estimated volume or count (e.g., "3 pcs", "500ml", "Half bag")
4. estimatedDaysToExpiry: estimate how many days left before this spoils from today's perspective (e.g. 3, 5, 12). If unsure default to 5.

Respond strictly in JSON format as an array under the key "ingredients".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: textPrompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  ingredientName: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Must be Vegetables, Proteins, Dairy, Grains, Pantry, Fruits, or Other" },
                  estimatedQty: { type: Type.STRING },
                  estimatedDaysToExpiry: { type: Type.INTEGER }
                },
                required: ["ingredientName", "category", "estimatedQty", "estimatedDaysToExpiry"]
              }
            }
          },
          required: ["ingredients"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{"ingredients": []}');

    // Convert to proper client-side Ingredient items with specific properties
    const today = new Date().toISOString().split('T')[0];
    const generatedIngredients = parsedData.ingredients.map((item: any, index: number) => {
      const days = item.estimatedDaysToExpiry || 5;
      const expDate = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
      const statusValue = days <= 2 ? 'expired' : days <= 4 ? 'warning' : 'fresh';

      return {
        id: `scanned_${index}_${Date.now()}`,
        name: item.ingredientName,
        category: item.category,
        quantity: item.estimatedQty || "1 unit",
        expiryDate: expDate,
        daysLeft: days,
        addedAt: today,
        status: statusValue
      };
    });

    return res.json({ ingredients: generatedIngredients, isMocked: false });

  } catch (error: any) {
    console.error("[SERVER] Fridge scanner computer vision error:", error);
    const randomSet = DETECTED_FRIDGE_LISTS[0];
    return res.status(200).json({
      ingredients: randomSet,
      isMocked: true,
      notice: "Fell back to high-fidelity visual simulations.",
      error: error.message
    });
  }
});

// ----------------- Vite Integration Middleware -----------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[SERVER] Dev environment. Injecting Vite HMR-free Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[SERVER] Production build detected. Static serving of dist...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[COOK-WITH-WHAT-YOU-HAVE] Platform burning on http://localhost:${PORT}`);
  });
}

startServer();
