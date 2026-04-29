import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';

/**
 * Full-screen loading UI (matches ProtectedRoute auth check), signs out via Supabase,
 * then redirects to role selection.
 */
const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await auth.signout();
      if (!cancelled) {
        navigate('/role-selection', { replace: true });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      <img
        src="/logo/Fast bite transparent I.png"
        alt="Fast Bites"
        className="h-1/2 w-1/2 object-contain animate-zoom-pulse"
      />
    </div>
  );
};

export default Logout;
