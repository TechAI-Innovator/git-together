const Intro1: React.FC = () => {
  const steps = [0, 1, 2, 3];
  const currentStep = 0;

  return (
    <div className="w-full min-h-screen bg-background relative overflow-hidden font-poppins">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/hyang-imant-YBkm-PnrSDI-unsplash 1.png')` }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        {/* Header with progress and skip */}
        <div className="flex items-center justify-between mb-auto">
          {/* Progress Indicator */}
          <div className="flex gap-2">
            {steps.map((step) => (
              <div
                key={step}
                className={`h-1 rounded-full transition-all duration-300 ${
                  step === currentStep 
                    ? 'w-12 bg-foreground' 
                    : 'w-8 bg-muted'
                }`}
              />
            ))}
          </div>
          
          {/* Skip Button */}
          <button className="text-foreground text-sm font-medium hover:opacity-80 transition-opacity">
            Skip
          </button>
        </div>
        
        {/* Main Content - Push to bottom */}
        <div className="mt-auto pb-8">
          {/* Heading */}
          <h1 className="text-3xl font-semibold text-foreground leading-tight mb-3">
            Introducing you to{' '}
            <span className="text-accent">fast delivery.</span>{' '}
            Build meal step by step.
          </h1>
          
          {/* Subtext */}
          <p className="text-muted-foreground text-sm mb-12">
            Each bite filled with flavour. From anywhere in your city
          </p>
          
          {/* Next Button */}
          <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-base font-medium hover:opacity-90 active:opacity-80 transition-opacity">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro1;

