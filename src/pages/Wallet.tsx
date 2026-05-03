import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../lib/api';
import BottomNav from '../components/BottomNav';
import { responsivePx } from '../constants/responsive';
import { PROFILE_AVATAR_IMAGE } from '../constants/profileAvatar';

interface UserProfile {
  first_name?: string;
  last_name?: string;
  /** If API returns a custom photo, use it; otherwise same default as Home. */
  profile_image?: string;
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

/** Wallet arrows from `public/assets` (replaces custom SVG icons). */
const WALLET_ARROW_DOWN = '/assets/arrow-down-Recovered.svg';
const WALLET_ARROW_UP = '/assets/arrow-up.png';
const WALLET_BANK_ICON = '/assets/bank 1.svg';

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
    if (type === 'sent') {
      return <img src={WALLET_ARROW_UP} alt="" className="h-7 w-7 object-contain" />;
    }
    if (type === 'received') {
      return <img src={WALLET_ARROW_DOWN} alt="" className="h-7 w-7 object-contain" />;
    }
    return <img src={WALLET_BANK_ICON} alt="" className="h-6 w-6 object-contain" />;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background pb-28 font-[var(--font-poppins)]">
      {/* Orange wallet background — covers ~3/5 */}
      <div
        className="absolute inset-x-0 top-0 h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/cart Background.png')" }}
        aria-hidden
      />

      <div className={`relative shrink-0 ${responsivePx} pt-10`}>
        {/* User greeting */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-foreground/30">
            <img
              src={user?.profile_image || PROFILE_AVATAR_IMAGE}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <p className="text-xs text-foreground/80">Welcome,</p>
            <h2 className="text-base font-semibold text-foreground">{fullName}</h2>
          </div>
        </div>

        {/* Balance */}
        <div className="mt-14 flex flex-col items-center">
          <p className="text-xs text-foreground/80">Your balance</p>
          <p className="mt-1 text-4xl font-semibold text-foreground">
            ₦{balance.toLocaleString()}
          </p>
        </div>

        {/* Deposit button */}
        <div className="mt-12">
          <button
            type="button"
            onClick={() => navigate('/deposit')}
            className="relative flex h-12 w-full items-center justify-center rounded-full bg-background"
          >
            <span className="absolute left-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <img src={WALLET_ARROW_DOWN} alt="" className="h-7 w-7 object-contain" />
            </span>
            <span className="text-lg text-primary">Deposit</span>
          </button>
        </div>

        {/* Add new card */}
        <button
          type="button"
          onClick={() => navigate('/deposit')}
          className="mx-auto mt-6 flex items-center gap-2 text-xs text-foreground/80"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-foreground">
            <Plus className="h-3 w-3 text-foreground" strokeWidth={3} />
          </span>
          <span>Add new card</span>
        </button>
      </div>

      {/* Transactions panel — flex-1 so #111111 fills viewport below the cards */}
      <div
        className={`relative mt-8 flex flex-1 flex-col rounded-t-3xl bg-[#111111] ${responsivePx} pt-6 pb-6`}
      >
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <h3 className="text-xs text-foreground/90">Transactions</h3>
          <button className="text-xs text-foreground/90">See all</button>
        </div>

        <div className="space-y-3">
          {TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-lg bg-overlay-panel-background p-2"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary">
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
                      ? 'text-popup-green'
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
                      ? 'text-foreground/80'
                      : 'text-popup-green'
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
