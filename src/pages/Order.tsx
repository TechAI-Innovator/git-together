import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import TabSwitcher from '../components/TabSwitcher';
import { responsivePx } from '../constants/responsive';

/* ── Types ─────────────────────────────────────────── */
interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  restaurant: string;
}

interface OngoingOrder {
  id: string;
  restaurant: string;
  items: string[];
  total: number;
  status: 'preparing' | 'on the way' | 'arriving';
  eta: string;
}

/* ── Dummy data ────────────────────────────────────── */
const DUMMY_ORDER_ITEMS: OrderItem[] = [
  {
    id: 'i1',
    name: 'Rice',
    description: 'Properly cooked plain local rice',
    price: 5000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    restaurant: 'Chicken Republic',
  },
  {
    id: 'i2',
    name: 'Blueberry Pancake',
    description: 'Fluffy cream filled blueberry pancake',
    price: 1500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    restaurant: 'Chicken Republic',
  },
];

const DUMMY_ONGOING: OngoingOrder[] = [
  {
    id: 'o1',
    restaurant: 'Chicken Republic',
    items: ['Rice x2', 'Stew x1'],
    total: 11500,
    status: 'preparing',
    eta: '25 mins',
  },
];

const DELIVERY_FEE = 1500;

const TABS = [
  { id: 'order', label: 'Order' },
  { id: 'ongoing', label: 'Ongoing' },
];

/* ── Component ─────────────────────────────────────── */
const Order: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('order');
  const [items, setItems] = useState<OrderItem[]>(DUMMY_ORDER_ITEMS);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  const deleteItem = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i,
      ),
    );
  };

  const toggleExpand = (id: string) =>
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const itemHasMultiServingBreakdown = (qty: number) => qty > 1;

  const renderItemName = (item: OrderItem) => {
    if (item.quantity > 1) {
      return (
        <>
          {item.name}
          <span className="ml-1 inline-block align-middle text-lg font-semibold text-primary">
            (+{item.quantity - 1})
          </span>
        </>
      );
    }
    return item.name;
  };

  // Demo breakdown
  const getBreakdown = (_item: OrderItem) => ({
    sauce: { name: 'Stew', price: 800 },
    secondServing: {
      main: { name: 'Rice', price: 1500 },
      sauce: { name: 'Cabbage sauce', price: 1200 },
      extras: [
        { name: 'Fried plantains', price: 700 },
        { name: 'Boiled egg', price: 100 },
      ],
    },
  });

  /* Group items by restaurant */
  const groupedByRestaurant = items.reduce<Record<string, OrderItem[]>>((acc, item) => {
    if (!acc[item.restaurant]) acc[item.restaurant] = [];
    acc[item.restaurant].push(item);
    return acc;
  }, {});

  const renderItemCard = (item: OrderItem) => {
    const hasBreakdown = itemHasMultiServingBreakdown(item.quantity);
    const isOpen = hasBreakdown && !!expandedItems[item.id];
    const breakdown = hasBreakdown ? getBreakdown(item) : null;

    return (
      <div
        key={item.id}
        className={`mb-4 rounded-xl bg-overlay-panel-background ${
          hasBreakdown && isOpen ? 'relative z-30 shadow-2xl' : ''
        } ${hasBreakdown ? '' : 'overflow-hidden'}`}
      >
        <div className={hasBreakdown ? 'overflow-hidden rounded-t-xl' : ''}>
          <div className="flex items-stretch gap-3 p-2">
            <div className="h-26 w-26 flex-shrink-0 overflow-hidden rounded-lg">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 min-w-0 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-foreground font-semibold text-lg leading-tight">
                  {renderItemName(item)}
                </h4>
                {hasBreakdown && isOpen ? (
                  <span aria-hidden className="text-foreground/80 pt-1">
                    <MoreHorizontal className="h-5 w-5" />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item.id)}
                    aria-label="Delete item"
                    className="text-foreground hover:text-foreground"
                  >
                    <img src="/assets/delete-white-2.png" alt="" className="h-5 w-5 object-contain" />
                  </button>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{item.description}</p>
              <p className="mt-1 text-primary font-regular text-lg">₦{item.price.toLocaleString()}</p>
              <div className="mt-auto flex items-center justify-end gap-1 pt-0">
                <div className="flex bg-black rounded-full items-center">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 text-black" strokeWidth={2.5} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {hasBreakdown && isOpen && breakdown && (
            <div className="px-4 py-6 space-y-4 border-t-3 border-t-black/40">
              <div>
                <p className="text-xs text-muted-foreground/70">Sauce:</p>
                <div className="flex items-center justify-between border-b border-white/40 pb-1">
                  <span className="text-foreground text-base">{breakdown.sauce.name}</span>
                  <span className="text-foreground text-base">₦{breakdown.sauce.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <h5 className="text-foreground text-xl">Second serving</h5>
                <div>
                  <p className="text-xs text-muted-foreground/70">Main:</p>
                  <div className="flex items-center justify-between border-b border-white/40 pb-1">
                    <span className="text-foreground text-base">{breakdown.secondServing.main.name}</span>
                    <span className="text-foreground text-base">₦{breakdown.secondServing.main.price.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/70">Sauce:</p>
                  <div className="flex items-center justify-between border-b border-white/40 pb-1">
                    <span className="text-foreground text-base">{breakdown.secondServing.sauce.name}</span>
                    <span className="text-foreground text-base">₦{breakdown.secondServing.sauce.price.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/70 mb-1">Extras:</p>
                  <div className="space-y-1.5">
                    {breakdown.secondServing.extras.map((ex) => (
                      <div key={ex.name} className="flex items-center justify-between">
                        <span className="text-foreground text-base">{ex.name}</span>
                        <span className="text-foreground text-base">₦{ex.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasBreakdown && (
          <button
            type="button"
            onClick={() => toggleExpand(item.id)}
            className="flex w-full items-center justify-center gap-2 text-xs py-1.5 rounded-b-xl bg-primary text-primary-foreground"
          >
            {isOpen ? 'See less' : 'See more'}
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>
    );
  };

  const statusColor = (status: OngoingOrder['status']) => {
    switch (status) {
      case 'preparing': return 'text-primary';
      case 'on the way': return 'text-app-green';
      case 'arriving': return 'text-app-green';
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-background font-[var(--font-poppins)]">
      {/* Header — same map+title BackButton used in Cart */}
      <div className={`absolute top-0 left-0 right-0 z-[50] ${responsivePx} pt-10`}>
        <BackButton variant="map" title="Order" />
      </div>
      <div className="h-20" />

      <div className={`${responsivePx} pb-10`}>
        {/* Tabs */}
        <TabSwitcher tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── Order Tab ──────────────────────────── */}
        {activeTab === 'order' && (
          <div className="mt-6">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">No items in your order</div>
            ) : (
              <>
                {Object.entries(groupedByRestaurant).map(([restaurant, restaurantItems]) => (
                  <div key={restaurant} className="mb-6">
                    <p className="mb-5 border-b border-primary-foreground/30 pb-1 text-sm text-muted-foreground">
                      {restaurant}
                    </p>
                    {restaurantItems.map((item) => renderItemCard(item))}
                  </div>
                ))}

                {/* Order Summary — rounded top, card bg, black/40 divider */}
                <div className="mt-8 bg-overlay-panel-background rounded-t-2xl p-5">
                  <h3 className="text-foreground font-bold text-base mb-4">Order Summary</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Sub total of items</span>
                    <span className="text-foreground">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground">Delivery fee</span>
                    <span className="text-foreground">₦{DELIVERY_FEE.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-black/40 pt-3 flex justify-between">
                    <span className="text-foreground font-bold text-sm">Total</span>
                    <span className="text-foreground font-bold text-sm">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout — reusable Button */}
                <div className="mt-6">
                  <Button onClick={() => navigate('/order-complete')} variant="primary">
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Ongoing Tab ────────────────────────── */}
        {activeTab === 'ongoing' && (
          <div className="mt-6">
            {DUMMY_ONGOING.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">No ongoing orders</div>
            ) : (
              DUMMY_ONGOING.map((order) => (
                <div key={order.id} className="bg-overlay-panel-background rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-foreground font-semibold text-base">{order.restaurant}</h3>
                    <span className={`text-xs font-medium capitalize ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm">{item}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-black/40 pt-3">
                    <span className="text-muted-foreground text-xs">ETA: {order.eta}</span>
                    <span className="text-foreground font-bold text-sm">₦{order.total.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation — copied from Cart */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div
            className="relative z-10 flex flex-col items-center gap-4 rounded-xl border border-white/15 bg-overlay-panel-background px-5 py-4 shadow-lg backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-foreground text-base font-medium">Delete item?</p>
            <div className="flex w-full min-w-[200px] gap-12">
              <button
                type="button"
                onClick={deleteItem}
                className="flex-1 rounded-md bg-app-green py-2 text-center text-sm font-semibold text-black transition-opacity hover:opacity-80"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-80"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
