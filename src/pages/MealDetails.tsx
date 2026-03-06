import React, { useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { responsivePx } from '../constants/responsive';
import BackButton from '../components/BackButton';
import Button from '../components/Button';

interface MealData {
  id: string;
  name: string;
  restaurant: string;
  time: string;
  price: string;
  image: string;
  rating?: number;
  description?: string;
}

const sauceOptions = [
  { id: 'none', name: 'No sauce', price: 0 },
  { id: 'tomato', name: 'Tomato sauce', price: 200 },
  { id: 'pepper', name: 'Pepper sauce', price: 300 },
  { id: 'garlic', name: 'Garlic sauce', price: 250 },
  { id: 'mayo', name: 'Mayonnaise', price: 150 },
];

const extrasOptions = [
  { id: 'cheese', name: 'Extra cheese', price: 500 },
  { id: 'chicken', name: 'Extra chicken', price: 800 },
  { id: 'plantain', name: 'Fried plantain', price: 400 },
  { id: 'coleslaw', name: 'Coleslaw', price: 300 },
  { id: 'egg', name: 'Fried egg', price: 250 },
];

const MealDetails: React.FC = () => {
  const location = useLocation();
  const meal = location.state as MealData | null;

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [selectedSauce, setSelectedSauce] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [showSauceDropdown, setShowSauceDropdown] = useState(false);
  const [showExtrasDropdown, setShowExtrasDropdown] = useState(false);

  // Bottom sheet state
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    dragCurrentY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragStartY.current - dragCurrentY.current;
    if (diff > 50) {
      setSheetExpanded(true);
    } else if (diff < -50) {
      setSheetExpanded(false);
    }
  }, []);

  if (!meal) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Meal not found</p>
      </div>
    );
  }

  const basePrice = parseFloat(meal.price.replace(/[₦,]/g, ''));
  const sauceCost = sauceOptions.find(s => s.id === selectedSauce)?.price || 0;
  const extrasCost = selectedExtras.reduce((total, extraId) => {
    const extra = extrasOptions.find(e => e.id === extraId);
    return total + (extra?.price || 0);
  }, 0);
  const totalPrice = (basePrice + sauceCost + extrasCost) * quantity;

  const description = meal.description ||
    "Crafted with a stone-baked crust, rich herb-infused sauce and a generous layer of melted cheese. Our pizza is loaded with fresh, high-quality toppings that deliver a rich and unforgettable flavor experience.";

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  return (
    <div className="w-full h-screen bg-background font-[var(--font-poppins)] flex flex-col overflow-hidden relative">
      {/* Food Image - fills the top portion */}
      <div className="relative w-full flex-1 min-h-0">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover"
        />

        {/* Header overlay: Back button + "Details" on same line */}
        <div className={`absolute top-0 left-0 right-0 ${responsivePx} pt-10 flex items-center`}>
          <BackButton variant="map" />
          <h1 className="flex-1 text-center text-foreground text-xl font-bold -ml-10">Details</h1>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute left-0 right-0 bg-background rounded-t-3xl transition-all duration-300 ease-out flex flex-col ${
          sheetExpanded ? 'top-[15%] bottom-0' : 'top-[55%] bottom-0'
        }`}
        style={{ zIndex: 20 }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab"
          onClick={() => setSheetExpanded(!sheetExpanded)}
        >
          <div className="w-12 h-1 bg-muted-foreground/50 rounded-full" />
        </div>

        {/* Sheet Content - scrollable when expanded */}
        <div className={`flex-1 overflow-y-auto ${responsivePx} pb-4`}>
          {/* Price Bar */}
          <div className="bg-primary/90 rounded-xl px-4 py-3 flex items-center justify-between mb-4">
            <span className="text-primary-foreground text-sm">Total price</span>
            <span className="text-primary-foreground text-xl font-bold">₦{totalPrice.toLocaleString()}</span>
          </div>

          {/* Title + Quantity */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <h2 className="text-foreground text-2xl font-bold">{meal.name}</h2>
              <p className="text-muted-foreground text-sm">
                Restaurant: {meal.restaurant.replace('From ', '')}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-muted/30 rounded-full px-3 py-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-6 h-6 rounded-full border border-muted-foreground flex items-center justify-center text-foreground"
              >
                −
              </button>
              <span className="text-foreground font-medium w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-6 h-6 rounded-full border border-muted-foreground flex items-center justify-center text-foreground"
              >
                +
              </button>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{meal.time}</span>
          </div>

          {/* Rating */}
          <div className="flex gap-0.5 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={star <= (meal.rating || 4) ? '#FFD700' : 'none'}
                stroke="#FFD700"
                strokeWidth="2"
              >
                <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
              </svg>
            ))}
          </div>

          {/* Expanded content - only visible when pulled up */}
          {sheetExpanded && (
            <div className="animate-fade-in">
              {/* Sauce Selection */}
              <div className="mb-4">
                <h3 className="text-foreground text-lg font-medium mb-2">Choose a sauce (required):</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowSauceDropdown(!showSauceDropdown)}
                    className="w-full bg-muted/30 border border-muted/40 rounded-xl p-3 text-left flex items-center justify-between"
                  >
                    <span className={selectedSauce ? 'text-foreground' : 'text-muted-foreground'}>
                      {selectedSauce ? sauceOptions.find(s => s.id === selectedSauce)?.name : 'Select a sauce'}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {showSauceDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-muted/40 rounded-xl overflow-hidden z-10">
                      {sauceOptions.map(sauce => (
                        <button
                          key={sauce.id}
                          onClick={() => {
                            setSelectedSauce(sauce.id);
                            setShowSauceDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm flex justify-between items-center hover:bg-muted/30 ${
                            selectedSauce === sauce.id ? 'bg-primary/20 text-primary' : 'text-foreground'
                          }`}
                        >
                          <span>{sauce.name}</span>
                          {sauce.price > 0 && <span className="text-muted-foreground">+₦{sauce.price}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-right text-sm text-muted-foreground mt-1">Cost: ₦{sauceCost}</p>
              </div>

              {/* Extras Selection */}
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-medium mb-2">Extras (Optional):</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowExtrasDropdown(!showExtrasDropdown)}
                    className="w-full bg-muted/30 border border-muted/40 rounded-xl p-3 text-left flex items-center justify-between"
                  >
                    <span className={selectedExtras.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                      {selectedExtras.length > 0
                        ? `${selectedExtras.length} extra${selectedExtras.length > 1 ? 's' : ''} selected`
                        : 'Select your extras'}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {showExtrasDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-muted/40 rounded-xl overflow-hidden z-10">
                      {extrasOptions.map(extra => (
                        <button
                          key={extra.id}
                          onClick={() => toggleExtra(extra.id)}
                          className={`w-full px-3 py-2 text-left text-sm flex justify-between items-center hover:bg-muted/30 ${
                            selectedExtras.includes(extra.id) ? 'bg-primary/20 text-primary' : 'text-foreground'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedExtras.includes(extra.id) ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}>
                              {selectedExtras.includes(extra.id) && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </span>
                            {extra.name}
                          </span>
                          <span className="text-muted-foreground">+₦{extra.price}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-right text-sm text-muted-foreground mt-1">Cost: ₦{extrasCost}</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Note */}
              <div className="mb-6">
                <h3 className="text-foreground text-lg font-medium mb-2">Note</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Input special requests, allergies etc."
                  className="w-full h-28 bg-muted/20 border border-muted/40 rounded-xl p-3 text-foreground text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Buttons - always visible */}
        <div className={`${responsivePx} pb-6 pt-3 flex gap-3 flex-shrink-0 bg-background`}>
          <Button variant="primary" className="flex-1 rounded-xl">
            Add to Cart
          </Button>
          <Button variant="accent" className="flex-1 rounded-xl">
            Order now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealDetails;
