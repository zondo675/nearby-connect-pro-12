import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InstagramLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (!error) {
        navigate('/home');
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in to ServiceHub.",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 items-center justify-center">
        <div className="relative">
          <div className="w-80 h-96 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  SH
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">ServiceHub</h2>
              <p className="text-white/80">Connect. Hire. Deliver.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Main content */}
      <div className="flex-1 lg:flex-none lg:w-96 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-xl font-bold text-white">SH</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">ServiceHub</h1>
          </div>

          {/* Login Form Container */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
            {/* Instagram-style logo */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-foreground tracking-wide">
                ServiceHub
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email Input */}
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Phone number, username, or email"
                  className="h-12 text-xs bg-muted/50 border-border focus:border-primary rounded-sm px-3"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="h-12 text-xs bg-muted/50 border-border focus:border-primary rounded-sm px-3 pr-12"
                  required
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground text-sm font-medium"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-sm text-sm disabled:bg-blue-300 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Log in'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-medium">OR</span>
              </div>
            </div>

            {/* Facebook Login */}
            <Button
              type="button"
              variant="ghost"
              className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm p-0 h-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Log in with Facebook
            </Button>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="bg-card border border-border rounded-lg p-6 text-center shadow-soft">
            <p className="text-sm text-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Get the app */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Get the app.</p>
            <div className="flex justify-center space-x-3">
              <img
                src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
                alt="Download on the App Store"
                className="h-10"
              />
              <img
                src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
                alt="Get it on Google Play"
                className="h-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramLogin;