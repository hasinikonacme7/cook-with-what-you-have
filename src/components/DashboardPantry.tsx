/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, Dispatch, SetStateAction, FormEvent, ChangeEvent } from 'react';
import { Ingredient } from '../types';
import { Search, Plus, Calendar, AlertTriangle, ShieldCheck, Trash2, Camera, UploadCloud, RefreshCw, Layers, Sparkles } from 'lucide-react';

interface DashboardPantryProps {
  ingredients: Ingredient[];
  setIngredients: Dispatch<SetStateAction<Ingredient[]>>;
  onAutoAdd?: (scannedItems: Ingredient[]) => void;
}

export default function DashboardPantry({ ingredients, setIngredients, onAutoAdd }: DashboardPantryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  // Custom single item form input states
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Vegetables');
  const [newQty, setNewQty] = useState('1 pc');
  const [newDays, setNewDays] = useState('5');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteIngredient = (id: string) => {
    setIngredients(prev => prev.filter(item => item.id !== id));
  };

  const handleCreateItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const days = parseInt(newDays, 10) || 5;
    const expDate = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
    const status: 'fresh' | 'warning' | 'expired' = days <= 2 ? 'expired' : days <= 4 ? 'warning' : 'fresh';

    const newItem: Ingredient = {
      id: `manual_${Date.now()}`,
      name: newName.trim(),
      category: newCat,
      quantity: newQty,
      expiryDate: expDate,
      daysLeft: days,
      addedAt: new Date().toISOString().split('T')[0],
      status
    };

    setIngredients(prev => [newItem, ...prev]);
    // reset form
    setNewName('');
    setNewQty('1 pc');
    setNewDays('5');
  };

  // Restock default samples for ease of testing
  const loadDemoPantry = () => {
    const today = new Date();
    const mockList: Ingredient[] = [
      { id: "p1", name: "Fresh Vine Tomatoes", category: "Vegetables", quantity: "3 pcs", expiryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], daysLeft: 3, addedAt: today.toISOString().split('T')[0], status: "warning" },
      { id: "p2", name: "Shredded Mozzarella Cheese", category: "Dairy", quantity: "200g", expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], daysLeft: 2, addedAt: today.toISOString().split('T')[0], status: "warning" },
      { id: "p3", name: "Whole Milk", category: "Dairy", quantity: "500ml", expiryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], daysLeft: 5, addedAt: today.toISOString().split('T')[0], status: "fresh" },
      { id: "p4", name: "Sweet Bell Pepper Mix", category: "Vegetables", quantity: "2 pcs", expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], daysLeft: 7, addedAt: today.toISOString().split('T')[0], status: "fresh" },
      { id: "p5", name: "Baby Leaf Spinach", category: "Vegetables", quantity: "150g", expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], daysLeft: 1, addedAt: today.toISOString().split('T')[0], status: "warning" },
      { id: "p6", name: "Organic Carrots", category: "Vegetables", quantity: "4 pcs", expiryDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0], daysLeft: 8, addedAt: today.toISOString().split('T')[0], status: "fresh" },
      { id: "p7", name: "Lasagna/Pasta sheets", category: "Grains", quantity: "1 pack", expiryDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0], daysLeft: 90, addedAt: today.toISOString().split('T')[0], status: "fresh" },
      { id: "p8", name: "Day-old Cold Rice", category: "Grains", quantity: "2 cups", expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], daysLeft: 1, addedAt: today.toISOString().split('T')[0], status: "warning" }
    ];
    setIngredients(mockList);
  };

  const clearEverything = () => {
    setIngredients([]);
  };

  // Triggers visual scanning with actual vision call or fallback simulated results
  const triggerImageScan = async (base64String: string | null) => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/scan-fridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64String }),
      });

      const data = await response.json();
      if (data.ingredients) {
        setIngredients(prev => {
          // Merge avoiding immediate duplicate names for perfect inventory addition
          const merged = [...prev];
          data.ingredients.forEach((newI: Ingredient) => {
            if (!merged.some(m => m.name.toLowerCase() === newI.name.toLowerCase())) {
              merged.unshift(newI);
            }
          });
          return merged;
        });

        if (onAutoAdd) {
          onAutoAdd(data.ingredients);
        }
      }
    } catch (err) {
      console.error("[PANTRY] Scan failed:", err);
    } finally {
      setIsScanning(false);
      setSelectedPhoto(null);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setSelectedPhoto(base64Str);
      triggerImageScan(base64Str);
    };
    reader.readAsDataURL(file);
  };

  const simulateVisionAudit = () => {
    // Uses a pre-cooked base64 simulation or pulls a random sample
    triggerImageScan(null);
  };

  const filteredItems = ingredients.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="pantry-dashboard-root">
      
      {/* LEFT: Smart Fridge Scanner & Visual audit tools */}
      <div className="space-y-6">
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4 font-sans">
          <div className="space-y-1">
            <h3 className="font-bold text-md text-natural-dark flex items-center gap-2">
              <Camera className="w-5 h-5 text-natural-green" />
              Smart Fridge visual Scanner
            </h3>
            <p className="text-natural-muted text-xs leading-normal">
              Snap a picture or upload an image of your open fridge, drawers, or kitchen pantry shelf. Gemini analyzes computer vision streams to extract inventory.
            </p>
          </div>

          {/* Scanner stage box */}
          <div className="border-2 border-dashed border-natural-border rounded-2xl p-6 text-center hover:bg-natural-light-bg transition relative overflow-hidden group min-h-[190px] flex flex-col justify-center items-center">
            {isScanning ? (
              <div className="space-y-3" id="scan-loading-indicator">
                <RefreshCw className="w-8 h-8 text-natural-green animate-spin mx-auto" />
                <span className="text-xs font-mono font-medium text-natural-dark block animate-pulse">
                  AI Computer Vision Auditing...
                </span>
                <span className="text-[10px] text-natural-muted block max-w-[200px]">
                  Identifying ingredients, classifying categories, estimating expiration dates...
                </span>
              </div>
            ) : selectedPhoto ? (
              <div className="space-y-2">
                <img src={selectedPhoto} className="max-h-24 rounded-lg object-cover mx-auto max-w-full shadow-sm" alt="Scanned fridge" />
                <span className="text-xs font-mono text-natural-muted block">Processing photo...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <UploadCloud className="w-8 h-8 text-natural-light-muted mx-auto group-hover:text-natural-green transition" />
                <div className="text-xs font-medium text-natural-text">
                  Drag & Drop fridge photo here
                </div>
                <div className="text-[10px] text-natural-muted">
                  Supports PNG, JPEG up to 6MB
                </div>
                
                {/* Trigger file input trigger */}
                <button
                  id="btn-upload-trigger"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-natural-light-bg hover:bg-natural-soft-bg rounded-xl text-[11px] text-natural-text font-medium transition border border-natural-border"
                >
                  Choose File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            )}

            {/* Sweep animated laser scan visual */}
            {isScanning && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-natural-green/20 via-natural-green to-natural-green/20 animate-bounce" style={{ animationDuration: '2s' }} />
            )}
          </div>

          {/* Rapid Simulation shortcuts */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono text-natural-muted block uppercase font-bold">Simulator Controls</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-simulate-vision-audit"
                onClick={simulateVisionAudit}
                className="w-full text-center py-2 bg-natural-green text-white hover:bg-natural-green-hover font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Simulate Scan
              </button>
              <button
                id="btn-demo-pantry-load"
                onClick={loadDemoPantry}
                className="w-full text-center py-2 bg-natural-light-bg hover:bg-natural-soft-bg text-natural-text border border-natural-border font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-natural-muted" />
                Load Demo List
              </button>
            </div>
          </div>
        </div>

        {/* Manual Pantry Ingredient Addition */}
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4 font-sans">
          <div className="border-b border-natural-border pb-2">
            <h4 className="font-bold text-xs text-natural-dark uppercase">
              Add Individual custom Item
            </h4>
          </div>

          <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 col-span-2">
                <label className="text-natural-muted text-[10px]">Ingredient Name</label>
                <input
                  type="text"
                  id="form-item-name"
                  placeholder="e.g. Greek Yogurt, Tortilla sheets"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-natural-border rounded-xl focus:border-natural-green/45 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-natural-muted text-[10px]">Category</label>
                <select
                  id="form-item-cat"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full p-2 border border-natural-border rounded-xl focus:border-natural-green/45 focus:outline-none bg-white font-sans text-xs"
                >
                  <option>Vegetables</option>
                  <option>Proteins</option>
                  <option>Dairy</option>
                  <option>Grains</option>
                  <option>Pantry</option>
                  <option>Fruits</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-natural-muted text-[10px]">Estimated Expiry</label>
                <select
                  id="form-item-expiry"
                  value={newDays}
                  onChange={(e) => setNewDays(e.target.value)}
                  className="w-full p-2 border border-natural-border rounded-xl focus:border-natural-green/45 focus:outline-none bg-white font-sans text-xs"
                >
                  <option value="1">Expires Tomorrow</option>
                  <option value="3">In 3 Days</option>
                  <option value="5">In 5 Days</option>
                  <option value="10">In 10 Days</option>
                  <option value="30">In 30 Days (Stable)</option>
                </select>
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-natural-muted text-[10px]">Estimated Quantity / Volume</label>
                <input
                  type="text"
                  id="form-item-qty"
                  placeholder="e.g. 500g, 2 pieces, Leftover bowl"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full p-2 border border-natural-border rounded-xl focus:border-natural-green/45 focus:outline-none"
                />
              </div>
            </div>

            <button
              id="btn-form-add"
              type="submit"
              className="w-full text-center py-2.5 bg-natural-green hover:bg-natural-green-hover text-white rounded-xl font-medium text-xs transition mt-2 flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add to Pantry
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT/CENTER: Active Pantry Inventory Catalog tracker */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-natural-border pb-4">
            <div>
              <h3 className="font-bold text-md text-natural-dark flex items-center gap-2">
                <Layers className="w-5 h-5 text-natural-green" />
                Your Kitchen Pantry Locker ({ingredients.length})
              </h3>
              <p className="text-natural-muted text-xs">
                Color-coded expiration flags identify items that need to be rescued first to reduce food waste.
              </p>
            </div>
            {ingredients.length > 0 && (
              <button
                id="btn-clear-all-pantry"
                onClick={clearEverything}
                className="text-natural-muted hover:text-red-500 transition text-xs font-medium flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Pantry
              </button>
            )}
          </div>

          {/* Filters shelf */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            {/* Search items */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-natural-light-muted" />
              <input
                type="text"
                id="pantry-search-box"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-natural-border rounded-full text-xs focus:border-natural-green/45 focus:outline-none"
              />
            </div>
            {/* Category selection */}
            <div className="flex flex-wrap gap-1 font-mono text-[11px]">
              {['All', 'Vegetables', 'Proteins', 'Dairy', 'Grains', 'Pantry'].map((cat) => (
                <button
                  key={cat}
                  id={`btn-cat-filter-${cat}`}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-natural-green-light text-natural-green border border-natural-green/30 font-bold'
                      : 'bg-natural-light-bg border border-natural-border text-natural-muted hover:bg-natural-soft-bg'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Active catalog shelf */}
          {ingredients.length === 0 ? (
            <div className="text-center py-16 space-y-4" id="empty-pantry-canvas">
              <Layers className="w-12 h-12 text-stone-300 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h4 className="font-bold text-stone-700 text-sm">Your Pantry is completely empty!</h4>
                <p className="text-stone-450 text-xs max-w-sm mx-auto">
                  Click 'Load Demo List' above or simulate a Smart Fridge Scan to populate your kitchen with items to cook with!
                </p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-stone-450 text-xs">
              No pantry items match your filter criteria. Try adjusting filters or searches!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isUrgent = item.daysLeft <= 2;
                const isModerate = item.daysLeft > 2 && item.daysLeft <= 4;

                return (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-2xl flex justify-between items-center transition font-sans ${
                      isUrgent
                        ? 'bg-[#FDF6F5] border-red-200'
                        : isModerate
                        ? 'bg-[#FCF9F2] border-amber-200'
                        : 'bg-natural-light-bg border border-natural-border'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-natural-dark text-xs">{item.name}</strong>
                        <span className="text-[9px] font-mono bg-natural-soft-bg text-[#2D2A26] px-2 py-0.5 rounded border border-natural-border">
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[10px] font-mono text-natural-muted">
                        <span>Qty: <strong>{item.quantity}</strong></span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Exp in: <strong className={isUrgent ? "text-red-600" : isModerate ? "text-amber-700" : "text-natural-text"}>
                            {item.daysLeft}d
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Critical visual badge status indicators */}
                      {isUrgent ? (
                        <span className="text-[10px] font-mono text-red-600 bg-red-100/50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Urgent Rescue
                        </span>
                      ) : isModerate ? (
                        <span className="text-[10px] font-mono text-amber-700 bg-amber-100/50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0 font-medium">
                          <AlertTriangle className="w-3 h-3" /> Near Expiry
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-natural-green bg-natural-green-light px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0 border border-natural-green/10">
                          <ShieldCheck className="w-3 h-3" /> Stable
                        </span>
                      )}

                      <button
                        id={`btn-pantry-delete-${item.id}`}
                        onClick={() => deleteIngredient(item.id)}
                        className="text-natural-light-muted hover:text-red-500 cursor-pointer p-1 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
