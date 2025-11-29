import { useNavigate } from 'react-router-dom';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-background flex flex-col font-[var(--font-poppins)] px-6">
      {/* Spacer to center content vertically */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Heading */}
        <h1 className="text-3xl font-light text-foreground text-center mb-2">
          Who are you?
        </h1>
        
        {/* Subtext */}
        <p className="text-muted-foreground text-sm text-center mb-10">
          Pick a role according to how you use the app
        </p>
        
        {/* Role Buttons */}
        <div className="flex flex-col gap-5">
          {/* Customer Button - Primary filled */}
          <button 
            onClick={() => navigate('/customer')}
            className="w-full py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Customer
          </button>
          
          {/* Rider Button - White outline */}
          <button 
            onClick={() => navigate('/rider')}
            className="w-full py-4 bg-transparent text-foreground border border-foreground rounded-full text-lg font-medium hover:bg-foreground/10 active:bg-foreground/20 transition-colors"
          >
            Rider
          </button>
          
          {/* Restaurant Button - Accent outline */}
          <button 
            onClick={() => navigate('/restaurant')}
            className="w-full py-4 bg-transparent text-accent border border-accent rounded-full text-lg font-medium hover:bg-accent/10 active:bg-accent/20 transition-colors"
          >
            Restaurant
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pb-8 pt-12">
        <p className="text-muted-foreground text-xs text-center">
          By using this application, you agree to our{' '}
          <span className="text-accent">Terms</span> and
          <br />
          <span className="text-accent">Privacy policy</span>.
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
