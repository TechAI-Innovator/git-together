import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, Building2, Plus } from 'lucide-react';
import api from '../lib/api';
import BottomNav from '../components/BottomNav';
import { responsivePx } from '../constants/responsive';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

type TxType = 'deposit' | 'sent' | 'received';
type TxStatus = 'Received' | 'Successful' | 'Fail';

interface Transaction {
  id: string;
  type: TxType;
  title: string;
  timeAgo: string;
  amount: number;
  isPositive: boolean;
  status: TxStatus;
}

const TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'deposit', title: 'Deposit', timeAgo: '5 mins. ago', amount: 5600, isPositive: true, status: 'Received' },
  { id: '2', type: 'sent', title: 'Sent', timeAgo: '23 mins. ago', amount: 2000, isPositive: false, status: 'Successful' },
  { id: '3', type: 'received', title: 'Received', timeAgo: '15 mins. ago', amount: 2000, isPositive: true, status: 'Successful' },
  { id: '4', type: 'deposit', title: 'Deposit', timeAgo: '2 hrs. ago', amount: 18000, isPositive: true, status: 'Received' },
  { id: '5', type: 'deposit', title: 'Deposit', timeAgo: '2 hrs. ago', amount: 18000, isPositive: true, status: 'Fail' },
];

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const balance = 23600;

  useEffect(() => {
    api.getProfile().then(({ data }) => {
      if (data) setUser(data as UserProfile);
    });
  }, []);

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'John Doe'
    : 'John Doe';

  const renderTxIcon = (type: TxType) => {
    if (type === 'sent') return <ArrowUp className="h-6 w-6 text-foreground" strokeWidth={2.25} />;
    if (type === 'received') return <ArrowDown className="h-6 w-6 text-foreground" strokeWidth={2.25} />;
    return <Building2 className="h-6 w-6 text-foreground" strokeWidth={2.25} />;
  };

  return (
    <div className="relative min-h-screen w-full bg-background pb-28 font-[var(--font-poppins)]">
      {/* Orange wallet background — covers ~3/5 */}
      <div
        className="absolute inset-x-0 top-0 h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/cart Background.png')" }}
        aria-hidden
      />

      <div className={`relative ${responsivePx} pt-10`}>
        {/* User greeting */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-foreground/30">
            <img
              src={user?.avatar_url || '/assets/user 1 1-home.png'}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <p className="text-xs text-foreground/90">Welcome,</p>
            <h2 className="text-base font-semibold text-foreground">{fullName}</h2>
          </div>
        </div>

        {/* Balance */}
        <div className="mt-14 flex flex-col items-center">
          <p className="text-sm text-foreground">Your balance</p>
          <p className="mt-1 text-5xl font-bold text-foreground">
            ₦{balance.toLocaleString()}
          </p>
        </div>

        {/* Deposit button */}
        <div className="mt-12">
          <button
            type="button"
            onClick={() => navigate('/deposit')}
            className="relative flex h-14 w-full items-center justify-center rounded-full bg-background"
          >
            <span className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
              <ArrowDown className="h-5 w-5 text-foreground" strokeWidth={2.5} />
            </span>
            <span className="text-base text-primary">Deposit</span>
          </button>
        </div>

        {/* Add new card */}
        <button
          type="button"
          onClick={() => navigate('/deposit')}
          className="mx-auto mt-4 flex items-center gap-2 text-sm text-foreground"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-foreground">
            <Plus className="h-3 w-3 text-foreground" strokeWidth={2.5} />
          </span>
          <span>Add new card</span>
        </button>
      </div>

      {/* Transactions panel */}
      <div className={`relative mt-8 rounded-t-3xl bg-background ${responsivePx} pt-6`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base text-foreground">Transactions</h3>
          <button className="text-xs text-muted-foreground/80">See all</button>
        </div>

        <div className="space-y-3">
          {TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-2xl bg-overlay-panel-background p-3"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary">
                {renderTxIcon(tx.type)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{tx.title}</p>
                <p className="text-xs text-muted-foreground/80">{tx.timeAgo}</p>
              </div>

              <div className="flex flex-col items-end">
                <span
                  className={`text-sm ${
                    tx.status === 'Fail'
                      ? 'text-primary'
                      : tx.isPositive
                      ? 'text-app-green'
                      : 'text-foreground'
                  }`}
                >
                  {tx.isPositive ? '+ ' : '- '}
                  {tx.amount.toLocaleString()} NGN
                </span>
                <span
                  className={`text-xs ${
                    tx.status === 'Fail'
                      ? 'text-primary'
                      : tx.status === 'Received'
                      ? 'text-foreground/70'
                      : 'text-app-green'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Wallet;
