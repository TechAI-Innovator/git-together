import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { responsivePx } from '../constants/responsive';

/* ── Types ─────────────────────────────────────────── */
interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  section: 'main' | 'extras';
}

interface RestaurantOrder {
  id: string;
  name: string;
  logo: string;
  items: CartItem[];
}

/* ── Dummy data ────────────────────────────────────── */
const DUMMY_ORDERS: RestaurantOrder[] = [
  {
    id: 'r1',
    name: 'Chicken Republic',
    logo: '/assets/chad-montano-MqT0asuoIcU-unsplash 2.png',
    items: [
      { id: 'i1', name: 'Rice', description: 'Properly cooked plain local rice', price: 5000, quantity: 1, image: '/assets/chad-montano-MqT0asuoIcU-unsplash 2.png', section: 'main' },
      { id: 'i2', name: 'Rice (+1)', description: 'Extra portion of local rice', price: 5000, quantity: 1, image: '/assets/chad-montano-MqT0asuoIcU-unsplash 2.png', section: 'main' },
      { id: 'i3', name: 'Stew', description: 'Fresh tomato stew', price: 1500, quantity: 1, image: '/assets/chad-montano-MqT0asuoIcU-unsplash 2.png', section: 'extras' },
      { id: 'i4', name: 'Boiled Egg', description: 'Boiled egg garnish', price: 500, quantity: 2, image: '/assets/chad-montano-MqT0asuoIcU-unsplash 2.png', section: 'extras' },
      { id: 'i5', name: 'Chicken', description: 'Grilled chicken piece', price: 3000, quantity: 1, image: '/assets/chad-montano-MqT0asuoIcU-unsplash 2.png', section: 'extras' },
    ],
  },
  {
    id: 'r2',
    name: "Domino's Pizza",
    logo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop',
    items: [
      { id: 'i6', name: 'Blueberry Pancake', description: 'Fluffy cream filled blueberry pancake', price: 1500, quantity: 1, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', section: 'main' },
    ],
  },
];

/* ── Component ─────────────────────────────────────── */
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RestaurantOrder[]>(DUMMY_ORDERS);
  const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ restaurantId: string; itemId: string } | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  /* helpers */
  const orderTotal = (items: CartItem[]) => items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = (items: CartItem[]) => items.reduce((s, i) => s + i.quantity, 0);

  const updateQuantity = (restaurantId: string, itemId: string, delta: number) => {
    setOrders((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, items: r.items.map((i) => (i.id === itemId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)) }
          : r,
      ),
    );
  };

  const deleteItem = () => {
    if (!deleteTarget) return;
    setOrders((prev) =>
      prev
        .map((r) =>
          r.id === deleteTarget.restaurantId
            ? { ...r, items: r.items.filter((i) => i.id !== deleteTarget.itemId) }
            : r,
        )
        .filter((r) => r.items.length > 0),
    );
    setDeleteTarget(null);
  };

  const removeRestaurant = () => {
    if (!removeTarget) return;
    setOrders((prev) => prev.filter((r) => r.id !== removeTarget));
    setRemoveTarget(null);
    setExpandedRestaurant(null);
  };

  const detailRestaurant =
    expandedRestaurant != null ? orders.find((r) => r.id === expandedRestaurant) ?? null : null;

  const toggleExpand = (id: string) =>
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderItemCard = (restaurant: RestaurantOrder, item: CartItem) => {
    const isOpen = !!expandedItems[item.id];
    return (
      <div key={item.id} className="mb-4 overflow-hidden rounded-xl bg-overlay-panel-background">
        <div className="flex items-stretch gap-3 p-3">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-1 min-w-0 flex-col">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-foreground font-bold text-base leading-tight">
                {item.name}
              </h4>
              <button
                type="button"
                onClick={() => setDeleteTarget({ restaurantId: restaurant.id, itemId: item.id })}
                aria-label="Delete item"
                className="text-foreground/80 hover:text-foreground"
              >
                <Trash2 className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{item.description}</p>
            <p className="mt-1 text-primary font-bold text-sm">₦{item.price.toLocaleString()}</p>
            <div className="mt-auto flex items-center justify-end gap-1 pt-2">
              <button
                type="button"
                onClick={() => updateQuantity(restaurant.id, item.id, -1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4 text-black" strokeWidth={2.5} />
              </button>
              <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(restaurant.id, item.id, 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4 text-white" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
        {item.description && item.description.length > 30 && (
          <button
            type="button"
            onClick={() => toggleExpand(item.id)}
            className="flex w-full items-center justify-center gap-2 rounded-b-xl bg-primary py-2 text-sm font-medium text-primary-foreground"
          >
            {isOpen ? 'See less' : 'See more'}
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
        {isOpen && (
          <div className="px-4 pb-3 text-xs text-muted-foreground">{item.description}</div>
        )}
      </div>
    );
  };


  const mainItems = detailRestaurant?.items.filter((i) => i.section === 'main') ?? [];
  const extraItems = detailRestaurant?.items.filter((i) => i.section === 'extras') ?? [];

  return (
    <div className="relative w-full min-h-screen bg-background font-[var(--font-poppins)]">
      <div className={`absolute top-0 left-0 right-0 z-[50] ${responsivePx} pt-10`}>
        <BackButton
          variant="map"
          title="Cart"
          {...(detailRestaurant ? { onBack: () => setExpandedRestaurant(null) } : {})}
        />
      </div>
      <div className="h-20" />

      <div className={`${responsivePx} mt-10 pb-28`}>
        {detailRestaurant ? (
          <>
            {mainItems.length > 0 && renderSection(detailRestaurant, 'Main', mainItems)}
            {extraItems.length > 0 && renderSection(detailRestaurant, 'Extras', extraItems)}
            <button
              onClick={() => navigate('/order')}
              className="mt-6 w-full rounded-full bg-app-green py-4 text-lg font-semibold text-background transition-opacity hover:opacity-90 active:opacity-80"
            >
              Proceed to order
            </button>
          </>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">Your cart is empty</div>
        ) : (
          orders.map((restaurant) => (
            <div key={restaurant.id} className="mb-4 rounded-xl bg-overlay-panel-background px-2 py-5">
              <div className="mb-6 flex w-full min-w-0 items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <img src={restaurant.logo} alt={restaurant.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex min-w-0 items-center justify-between gap-2">
                    <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
                      {restaurant.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setExpandedRestaurant(restaurant.id)}
                      className="flex-shrink-0 text-xs text-white underline"
                    >
                      Show items
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {itemCount(restaurant.items)} Items | ₦{orderTotal(restaurant.items).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/order')}
                  className="flex-1 rounded-xl bg-app-green py-3 text-sm text-background transition-opacity hover:opacity-90"
                >
                  Checkout
                </button>
                <button
                  onClick={() => setRemoveTarget(restaurant.id)}
                  className="flex-1 rounded-xl border-2 border-primary py-3 text-sm text-primary transition-opacity hover:opacity-80"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Delete item?"
        message="Are you sure you want to remove this item from your cart?"
        confirmLabel="Delete"
        cancelLabel="Keep"
        confirmVariant="danger"
        onConfirm={deleteItem}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        visible={!!removeTarget}
        title="Remove order?"
        message="All items from this restaurant will be removed from your cart."
        confirmLabel="Remove"
        cancelLabel="Keep"
        confirmVariant="danger"
        onConfirm={removeRestaurant}
        onCancel={() => setRemoveTarget(null)}
      />
      <BottomNav />
    </div>
  );
};

export default Cart;
