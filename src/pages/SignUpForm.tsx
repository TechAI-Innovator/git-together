import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement sign up logic
    console.log('Sign up with:', { email, password });
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col font-[var(--font-poppins)] px-6">
      {/* Back Button */}
      <div className="pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="text-foreground text-4xl"
        >
          &#x3c;
        </button>
      </div>

      {/* Logo */}
      <div className="mt-8 mb-4">
        <img 
          src="/logo/Fast bite transparent I.png" 
          alt="Fast Bites" 
          className="h-10 object-contain"
        />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-foreground mb-1">
        Sign up
      </h1>
      
      {/* Subtext */}
      <p className="text-muted-foreground text-sm mb-6">
        Create an account
      </p>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-10">
        <div className="flex-1 h-1 bg-primary rounded-full"></div>
        <div className="flex-1 h-1 bg-muted rounded-full"></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Email Field */}
        <label className="text-foreground text-sm mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E.g johndoe@gmail.com"
          className="w-full py-4 px-4 bg-transparent border border-muted rounded-xl text-foreground placeholder:text-muted-foreground mb-4"
        />

        {/* Password Field */}
        <label className="text-foreground text-sm mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum of 6 characters"
          className="w-full py-4 px-4 bg-transparent border border-muted rounded-xl text-foreground placeholder:text-muted-foreground mb-6"
        />

        {/* Continue Button */}
        <button 
          type="submit"
          className="w-full py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium mb-6"
        >
          Continue
        </button>
      </form>

      {/* Divider with Or */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-muted"></div>
        <span className="text-muted-foreground text-lg font-bold">Or</span>
        <div className="flex-1 h-px bg-muted"></div>
      </div>

      {/* Social Sign Up Buttons */}
      <div className="flex flex-col gap-4">
        {/* Google Button */}
        <button 
          className="w-full py-4 bg-foreground text-background rounded-full text-base font-medium flex items-center justify-center gap-3"
        >
          <img src="/assets/google.svg" alt="Google" className="w-6 h-6" />
          Sign up with Google
        </button>
        
        {/* Apple Button */}
        <button 
          className="w-full py-4 bg-foreground text-background rounded-full text-base font-medium flex items-center justify-center gap-3"
        >
          <img src="/assets/apple.svg" alt="Apple" className="w-6 h-6" />
          Sign up with Apple
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* Footer */}
      <div className="pb-8 pt-12">
        <p className="text-muted-foreground text-xs text-center">
          By using this application, you agree to our{' '}
          <button 
            onClick={() => navigate('/terms')}
            className="text-primary"
          >
            Terms
          </button>{' '}
          and
          <br />
          <button 
            onClick={() => navigate('/privacy-policy')}
            className="text-primary"
          >
            Privacy policy
          </button>.
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
