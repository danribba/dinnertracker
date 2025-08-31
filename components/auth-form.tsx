'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Utensils, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isResetPassword) {
        await resetPassword(email);
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions.",
        });
        setIsResetPassword(false);
        return;
      }

      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (isResetPassword) {
    return (
      <div className="flex items-center justify-center p-2 sm:p-4 w-full max-w-md mx-auto" style={{ WebkitTextSizeAdjust: '100%' }}>
        <div className="w-full space-y-5 bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md border border-[#E9DFCE]">
          <div className="text-center space-y-4">
            <button
              onClick={() => setIsResetPassword(false)}
              className="flex items-center text-sm text-[#A18249] hover:text-[#1C160C] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </button>
            
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 bg-[#019863] rounded-full flex items-center justify-center mb-3">
                <Utensils className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C160C]">Reset Password</h1>
              <p className="text-[#A18249] mt-1 sm:mt-2 text-xs sm:text-sm max-w-sm">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1C160C]">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-[#E9DFCE] focus:border-[#019863] focus:ring-[#019863] text-base"
                required
                style={{ fontSize: 16 }}
              />
            </div>

            <Button type="submit" className="w-full h-10 text-base font-medium bg-[#019863] hover:bg-[#018957] text-white rounded-full">
              Send Reset Instructions
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-2 sm:p-4 w-full max-w-md mx-auto" style={{ WebkitTextSizeAdjust: '100%' }}>
      <div className="w-full space-y-5 bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md border border-[#E9DFCE]">
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 bg-[#019863] rounded-full flex items-center justify-center mb-3">
              <Utensils className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C160C]">DinnerTracker</h1>
            <p className="text-[#A18249] mt-1 sm:mt-2 text-xs sm:text-sm max-w-sm">
              {isSignUp 
                ? 'Create an account to start tracking your dinner dates'
                : 'Welcome back! Sign in to continue tracking your dinner dates'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[#1C160C] text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-[#E9DFCE] focus:border-[#019863] focus:ring-[#019863] text-base"
                required
                style={{ fontSize: 16 }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-[#1C160C] text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 border-[#E9DFCE] focus:border-[#019863] focus:ring-[#019863] text-base"
                required
                style={{ fontSize: 16 }}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-10 text-base font-medium bg-[#019863] hover:bg-[#018957] text-white rounded-full">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col gap-1 text-sm text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#A18249] text-xs sm:text-sm hover:text-[#1C160C] transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
            
            {!isSignUp && (
              <button
                type="button"
                onClick={() => setIsResetPassword(true)}
                className="text-[#A18249] text-xs sm:text-sm hover:text-[#1C160C] transition-colors"
              >
                Forgot your password?
              </button>
            )}
          </div>

          <div className="border-t border-[#E9DFCE] pt-3">
            <Link 
              href="/about"
              className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[#A18249] hover:text-[#1C160C] transition-colors"
            >
              <Info className="h-4 w-4" />
              Learn more about Dinner Tracker
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}