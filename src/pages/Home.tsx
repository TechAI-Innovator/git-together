import React, { useState } from 'react';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const categories = [
    { name: 'Shops', image: '/assets/shops.png' },
    { name: 'Pharmacy', image: '/assets/phamarcy.png' },
    { name: 'Local Market', image: '/assets/local market.png' },
  ];

  const meals = [
    {
      name: 'Pizza',
      restaurant: 'From Domino\'s pizza',
      time: '1 hr 40 mins',
      calories: '266Kal',
      price: '₦6,500',
      image: '/assets/meal-home.png',
    },
    {
      name: 'Pancakes',
      restaurant: 'From Pancake Heaven',
      time: '20 mins',
      calories: '175Kal',
      price: '₦3,200',
      image: '/assets/pancakes-home.png',
    },
    {
      name: 'Featured 1',
      restaurant: 'From Local Kitchen',
      time: '30 mins',
      calories: '200Kal',
      price: '₦4,500',
      image: '/assets/below 1-home.png',
    },
    {
      name: 'Featured 2',
      restaurant: 'From Chef\'s Table',
      time: '45 mins',
      calories: '320Kal',
      price: '₦5,800',
      image: '/assets/below 2-home.png',
    },
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: '/assets/Home-home.png' },
    { id: 'discover', label: 'Discover', icon: '/assets/Discover-home.png' },
    { id: 'support', label: 'Support', icon: '/assets/Chat-home.png' },
    { id: 'wallet', label: 'Wallet', icon: '/assets/Wallet-home.png' },
  ];

  return (
    <div className="w-full min-h-screen bg-background font-[var(--font-poppins)] pb-24">
      {/* 1st section - Header */}
      <div className="flex items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden">
            <img 
              src="/assets/user 1 1-home.png" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-foreground font-semibold text-base">John Doe</h2>
            <p className="text-muted-foreground text-xs">123 Nigeria road</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center">
            <img 
              src="/assets/history-home.png" 
              alt="History" 
              className="w-6 h-6"
            />
          </button>
          <button className="w-10 h-10 flex items-center justify-center">
            <img 
              src="/assets/shopping-cart-home.png" 
              alt="Cart" 
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      {/* 2nd section - Search */}
      <div className="px-4 mt-4">
        <div className="flex items-center bg-primary/20 rounded-lg px-4 py-3 gap-3">
          <img 
            src="/assets/search 2.png" 
            alt="Search" 
            className="w-5 h-5 opacity-70"
          />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent text-foreground placeholder:text-muted-foreground text-sm flex-1 outline-none"
          />
        </div>
      </div>

      {/* 3rd section - Categories */}
      <div className="px-4 mt-6">
        {/* Restaurants - Large Card */}
        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
          <img 
            src="/assets/restaurants-home.png" 
            alt="Restaurants" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-foreground font-semibold text-xl">Restaurants</span>
          </div>
        </div>

        {/* Small Category Cards */}
        <div className="flex gap-2">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="relative flex-1 h-24 rounded-xl overflow-hidden"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                <span className="text-foreground font-medium text-sm">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4th section - Meals */}
      <div className="px-4 mt-6">
        <h2 className="text-foreground font-bold text-2xl mb-4">Meals</h2>
        
        {/* First row - 2 cards */}
        <div className="flex gap-3 mb-3">
          {meals.slice(0, 2).map((meal) => (
            <div 
              key={meal.name} 
              className="flex-1 bg-background border border-muted/30 rounded-xl overflow-hidden"
            >
              <div className="h-32 overflow-hidden">
                <img 
                  src={meal.image} 
                  alt={meal.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-foreground font-semibold text-base">{meal.name}</h3>
                <p className="text-muted-foreground text-xs">{meal.restaurant}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                  <img 
                    src="/assets/stopwatch 1-home.png" 
                    alt="Time" 
                    className="w-3 h-3"
                  />
                  <span>{meal.time}</span>
                  <span className="text-muted-foreground mx-1">|</span>
                  <span className="text-muted-foreground">{meal.calories}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-foreground font-bold text-base">{meal.price}</span>
                  <button className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <img 
                      src="/assets/plus 1-home.png" 
                      alt="Add" 
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second row - 3rd card 20% showing, 4th card visible */}
        <div className="flex gap-3 overflow-hidden">
          {meals.slice(2, 4).map((meal, index) => (
            <div 
              key={meal.name} 
              className={`flex-1 bg-background border border-muted/30 rounded-xl overflow-hidden ${
                index === 1 ? 'translate-x-[80%]' : ''
              }`}
            >
              <div className="h-32 overflow-hidden">
                <img 
                  src={meal.image} 
                  alt={meal.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5th section - Bottom Navigation (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-muted/20 px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-primary' 
                  : 'bg-transparent'
              }`}
            >
              <img 
                src={item.icon} 
                alt={item.label} 
                className="w-6 h-6"
              />
              <span className={`text-xs ${
                activeTab === item.id 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
