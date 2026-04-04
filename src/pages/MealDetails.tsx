import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { responsivePx } from '../constants/responsive';
import Button from '../components/Button';
import BackButton from '../components/BackButton';

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

const sizeOptions = ['Small', 'Medium', 'Large'];
const sauceOptions = ['Stew', 'Vegetable sauce', 'Chicken sauce'];
const extrasOptions = ['Extra cheese', 'Plantain', 'Coleslaw'];

/** Stable ₦ amount per meal + option (feels random, doesn’t change on re-render). */
function optionPriceNaira(label: string, mealId: string, kind: 'sauce' | 'extra'): number {
  let h = 0;
  const str = `${kind}|${mealId}|${label}`;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33 + str.charCodeAt(i)) >>> 0;
  }
  if (kind === 'sauce') {
    return 200 + (h % 501);
  }
  return 150 + (h % 451);
}

/** Home passes meal as state directly; restaurant flow passes { meal, restaurant }. */
function parseMealState(state: unknown): MealData | null {
  if (!state || typeof state !== 'object') return null;
  if ('meal' in state && state.meal && typeof state.meal === 'object') {
    return state.meal as MealData;
  }
  return state as MealData;
}

const MealDetails: React.FC = () => {
  const location = useLocation();
  const { restaurantId } = useParams<{ restaurantId?: string; mealId?: string }>();

  const meal = useMemo(
    () => parseMealState(location.state),
    [location.state]
  );

  /** Under /restaurant/:id/meal/:id — back goes to restaurant profile (history), not Home */
  const fromRestaurantContext = Boolean(restaurantId);

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [selectedSize, setSelectedSize] = useState('Small');
  const [selectedSauce, setSelectedSauce] = useState('');
  const [sauceOpen, setSauceOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState('');
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const collapseSheet = useCallback(() => {
    setSheetExpanded(false);
    setSauceOpen(false);
    setExtrasOpen(false);
  }, []);

  const expandSheet = useCallback(() => {
    setSheetExpanded(true);
  }, []);

  const restaurantDropdownOpen =
    fromRestaurantContext && sheetExpanded && (sauceOpen || extrasOpen);

  const mealIdForPricing = meal?.id ?? '';

  const saucePriceMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of sauceOptions) {
      m[s] = optionPriceNaira(s, mealIdForPricing, 'sauce');
    }
    return m;
  }, [mealIdForPricing]);

  const extrasPriceMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of extrasOptions) {
      m[e] = optionPriceNaira(e, mealIdForPricing, 'extra');
    }
    return m;
  }, [mealIdForPricing]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragStartY.current - dragCurrentY.current;
    if (diff > 50) {
      expandSheet();
    } else if (diff < -50) {
      collapseSheet();
    }
  }, [expandSheet, collapseSheet]);

  if (!meal) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Meal not found</p>
      </div>
    );
  }

  const basePrice = parseFloat(meal.price.replace(/[₦,]/g, ''));
  const selectedSaucePrice = selectedSauce ? saucePriceMap[selectedSauce] ?? 0 : 0;
  const selectedExtrasPrice = selectedExtras ? extrasPriceMap[selectedExtras] ?? 0 : 0;
  const totalPrice =
    basePrice * quantity +
    (fromRestaurantContext ? selectedSaucePrice + selectedExtrasPrice : 0);

  const description = meal.description ||
    "Crafted with a stone-baked crust, rich herb-infused sauce and a generous layer of melted cheese. Our pizza is loaded with fresh, high-quality toppings that deliver a rich and unforgettable flavor experience.";

  return (
    <div className="w-full h-screen bg-background font-[var(--font-poppins)] flex flex-col overflow-hidden relative">
      {/* Food Image with backdrop gradient */}
      <div className="relative w-full flex-1 min-h-0">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-120 h-120 object-cover min-[450px]:w-[50rem] min-[450px]:h-[50rem] min-[450px]:object-cover"
        />
        {/* Dark gradient backdrop overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>

      {/* Header - sibling of sheet, higher z-index so it stays on top and clickable */}
      <div className={`absolute top-0 left-0 right-0 z-[50] ${responsivePx} pt-10`}>
        <BackButton
          variant="map"
          title="Details"
          {...(fromRestaurantContext ? {} : { to: '/home' })}
        />
      </div>

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`absolute left-0 right-0 bg-background rounded-t-4xl transition-all duration-300 ease-out flex flex-col ${
          sheetExpanded ? 'top-[15%] bottom-0' : 'top-[55%] bottom-0'
        }`}
        style={{ zIndex: 20 }}
      >
        {/* Drag Handle + Price Bar */}
        <div className="flex flex-col flex-1 min-h-0 text-foreground bg-primary rounded-t-4xl">
          
          {/* Drag handle area */}
          <div
            className="flex-shrink-0 cursor-grab"
            onClick={() => (sheetExpanded ? collapseSheet() : expandSheet())}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex justify-center pt-3">
              <div className="w-24 h-2 bg-background rounded-full" />
            </div>
            {/* Price Bar */}
            <div className={`${responsivePx} py-3 flex items-center justify-between`}>
              <span className="text-primary-foreground/90 text-sm">Total price</span>
              <span className="text-primary-foreground text-xl font-bold">₦{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Sheet content: restaurant flow locks scroll + sauce/extras until sheet is expanded */}
          <div
            className={`flex-1 min-h-0 ${responsivePx} bg-background rounded-t-4xl ${
              fromRestaurantContext && !sheetExpanded
                ? 'overflow-y-hidden'
                : restaurantDropdownOpen
                  ? 'overflow-visible'
                  : 'overflow-y-auto'
            }`}
          >
            
            {/* Meal info card - mirroring Home meal card style */}
            <div className="flex items-start justify-between mb-1 pt-4">
              <div className="flex-1">
                <h2 className="text-foreground text-2xl font-medium">{meal.name}</h2>
                <p className="text-muted-foreground text-xs truncate">
                  Restaurant: {meal.restaurant.replace('From ', '')}
                </p>
                <div className="flex items-center gap-1 my-1 text-xs text-muted-foreground">
                  <img 
                    src="/assets/stopwatch 1-home.png" 
                    alt="Time" 
                    className="w-4 h-4"
                  />
                  <span>{meal.time}</span>
                </div>
              </div>

              {/* Quantity control */}
              <div className="flex items-center gap-4 bg-foreground rounded-full px-3 py-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  <img src="/assets/Minus.png" alt="Decrease" className="w-4 h-4" />
                </button>
                <span className="text-background font-bold w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  <img src="/assets/Plus.png" alt="Increase" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-0.5 mb-5">
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

            {fromRestaurantContext ? (
              <div
                className={
                  !sheetExpanded
                    ? 'pointer-events-none select-none opacity-50'
                    : undefined
                }
                aria-hidden={!sheetExpanded}
              >
                {/* Sauce & extras — same layout; inactive until sheet expanded (scroll also locked above) */}
                <div className="mb-2">
                  <h3 className="text-foreground text-lg font-light mb-2">Choose a sauce (required):</h3>
                  <div className={`relative ${sauceOpen ? 'z-40' : 'z-0'}`}>
                    <button
                      type="button"
                      tabIndex={sheetExpanded ? 0 : -1}
                      onClick={() => {
                        if (!sheetExpanded) return;
                        setSauceOpen(!sauceOpen);
                        setExtrasOpen(false);
                      }}
                      className="relative z-10 flex w-full items-center justify-between rounded-lg border border-muted-foreground/40 bg-background p-3 text-sm"
                    >
                      <span className={selectedSauce ? 'text-foreground' : 'text-muted-foreground/50'}>
                        {selectedSauce || 'Select a sauce'}
                      </span>
                      <img src="/assets/down-arrow.svg" alt="" className={`h-4 w-4 transition-transform ${sauceOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sauceOpen && sheetExpanded && (
                      <div
                        className="absolute left-0 right-0 top-full z-50 flex flex-col gap-7 rounded-lg border border-muted-foreground/40 bg-background py-7 pl-3 pr-3 shadow-lg"
                        role="listbox"
                      >
                        {sauceOptions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            role="option"
                            onClick={() => {
                              setSelectedSauce(s);
                              setSauceOpen(false);
                            }}
                            className="flex w-full items-center justify-between gap-3 bg-transparent text-left text-sm text-foreground transition-opacity hover:opacity-80"
                          >
                            <span className="min-w-0">{s}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              ₦{saucePriceMap[s].toLocaleString()}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p
                    className={`mt-1 text-right text-xs ${
                      selectedSauce ? 'font-medium text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    Cost: ₦{selectedSauce ? selectedSaucePrice.toLocaleString() : '0'}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-foreground text-lg font-light mb-2">Extras (Optional):</h3>
                  <div className={`relative ${extrasOpen ? 'z-40' : 'z-0'}`}>
                    <button
                      type="button"
                      tabIndex={sheetExpanded ? 0 : -1}
                      onClick={() => {
                        if (!sheetExpanded) return;
                        setExtrasOpen(!extrasOpen);
                        setSauceOpen(false);
                      }}
                      className="relative z-10 flex w-full items-center justify-between rounded-lg border border-muted-foreground/40 bg-background p-3 text-sm"
                    >
                      <span className={selectedExtras ? 'text-foreground' : 'text-muted-foreground/50'}>
                        {selectedExtras || 'Select your extras'}
                      </span>
                      <img src="/assets/down-arrow.svg" alt="" className={`h-4 w-4 transition-transform ${extrasOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {extrasOpen && sheetExpanded && (
                      <div
                        className="absolute left-0 right-0 top-full z-50 flex flex-col gap-7 rounded-lg border border-muted-foreground/40 bg-background py-7 pl-3 pr-3 shadow-lg"
                        role="listbox"
                      >
                        {extrasOptions.map((e) => (
                          <button
                            key={e}
                            type="button"
                            role="option"
                            onClick={() => {
                              setSelectedExtras(e);
                              setExtrasOpen(false);
                            }}
                            className="flex w-full items-center justify-between gap-3 bg-transparent text-left text-sm text-foreground transition-opacity hover:opacity-80"
                          >
                            <span className="min-w-0">{e}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              ₦{extrasPriceMap[e].toLocaleString()}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p
                    className={`mt-1 text-right text-xs ${
                      selectedExtras ? 'font-medium text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    Cost: ₦{selectedExtras ? selectedExtrasPrice.toLocaleString() : '0'}
                  </p>
                </div>
              </div>
            ) : (
              /* Size options for home flow */
              <div className="mb-4">
                <h3 className="text-foreground text-lg font-light mb-2">Size Options:</h3>
                <div className="flex gap-3">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-2 rounded-full text-xs font-light transition-all ${
                        selectedSize === size
                          ? 'bg-primary border border-primary text-primary-foreground'
                          : 'bg-transparent border border-primary text-muted-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {sheetExpanded && (
              <div className="animate-fade-in">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-light mb-2">Description</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Note */}
                <div className="mb-6">
                  <h3 className="text-foreground text-lg font-light mb-2">Note</h3>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Input special requests, allergies etc."
                    className="w-full h-28 bg-muted/35 rounded-xl p-3 text-foreground text-xs placeholder:text-muted-foreground/50 resize-none focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Buttons - toggle style like RoleSelection */}
        <div className={`${responsivePx} pb-6 pt-3 flex gap-3 flex-shrink-0`}>
          <Button
            variant="primary"
            className={`flex-1 ${addedToCart ? '!bg-transparent border-2 border-primary !text-primary' : ''}`}
            onClick={() => setAddedToCart(!addedToCart)}
          >
            Add to Cart
          </Button>
          <Button variant="accent" className="flex-1">
            Order now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealDetails;