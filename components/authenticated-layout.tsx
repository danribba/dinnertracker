'use client';

import { useState } from 'react';
import { Plus, LogOut, Menu, Utensils, Info, BarChart2, Users, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AddCoupleDialog } from '@/components/add-couple-dialog';
import { AddDinnerDateDialog } from '@/components/add-dinner-date-dialog';

export function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAddCoupleOpen, setIsAddCoupleOpen] = useState(false);
  const [isAddDinnerDateOpen, setIsAddDinnerDateOpen] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "You have been signed out locally.",
        variant: "default",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-black text-white w-full h-[72px] md:h-20 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo - Left Side */}
          <div className="flex items-center">
            <div className="h-11 w-11 md:h-12 md:w-12 bg-[#019863] rounded-full flex items-center justify-center">
              <Utensils className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </div>
            <span className="ml-3 font-bold text-xl hidden md:block">DinnerTracker</span>
          </div>

          {/* Title - Centered on mobile, left on desktop */}
          <h2 className="text-lg md:text-xl font-bold absolute left-1/2 -translate-x-1/2 md:hidden">
            Dinnertracker.com
          </h2>

          {/* Mobile Menu - Right Side */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#019863] hover:text-[#019863]/80">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full mt-[72px] p-0 border-t-0">
                <div className="flex flex-col gap-3 p-4 bg-white">
                  <Button 
                    onClick={() => setIsAddCoupleOpen(true)} 
                    className="w-full justify-start text-[#1C160C] hover:bg-[#E9DFCE]/20 text-sm"
                    variant="ghost"
                  >
                    <Plus className="w-4 h-4 mr-2 text-[#019863]" />
                    Add Couple
                  </Button>
                  <Link href="/couples" className="w-full">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start text-[#1C160C] hover:bg-[#E9DFCE]/20 text-sm"
                    >
                      <Users className="w-4 h-4 mr-2 text-[#019863]" />
                      Manage Couples
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => setIsAddDinnerDateOpen(true)} 
                    className="w-full justify-start text-[#1C160C] hover:bg-[#E9DFCE]/20 text-sm"
                    variant="ghost"
                  >
                    <Plus className="w-4 h-4 mr-2 text-[#019863]" />
                    Add Dinner Date
                  </Button>
                  <Link href="/stats" className="w-full">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start text-[#1C160C] hover:bg-[#E9DFCE]/20 text-sm"
                    >
                      <BarChart2 className="w-4 h-4 mr-2 text-[#019863]" />
                      Statistics
                    </Button>
                  </Link>
                  <Link href="/about" className="w-full">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start text-[#1C160C] hover:bg-[#E9DFCE]/20 text-sm"
                    >
                      <Info className="w-4 h-4 mr-2 text-[#019863]" />
                      About
                    </Button>
                  </Link>
                  <Link href="/faq" className="w-full">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start text-[#1C160C] hover:bg-[#E9DFCE]/20 text-sm"
                    >
                      <HelpCircle className="w-4 h-4 mr-2 text-[#019863]" />
                      FAQ
                    </Button>
                  </Link>
                  <Button 
                    variant="default" 
                    onClick={handleSignOut} 
                    className="w-full justify-start text-white border-white/20 text-sm bg-[#019863] hover:bg-[#018855]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Buttons - Right Side */}
          <div className="hidden md:flex items-center gap-2">
            <Button onClick={() => setIsAddCoupleOpen(true)} variant="ghost" size="sm" className="text-white hover:text-[#019863] hover: bg-black/50">
              <Plus className="w-4 h-4 mr-2 text-[#019863]" />
              Add Couple
            </Button>
            <Link href="/couples">
              <Button variant="ghost" size="sm" className="text-white hover:text-[#019863] hover: bg-black/50">
                <Users className="w-4 h-4 mr-2 text-[#019863]" />
                Manage Couples
              </Button>
            </Link>
            <Button onClick={() => setIsAddDinnerDateOpen(true)} variant="ghost" size="sm" className="text-white hover:text-[#019863] hover: bg-black/50">
              <Plus className="w-4 h-4 mr-2 text-[#019863]" />
              Add Dinner Date
            </Button>
            <Link href="/stats">
              <Button variant="ghost" size="sm" className="text-white hover:text-[#019863] hover: bg-black/50">
                <BarChart2 className="w-4 h-4 mr-2 text-[#019863]" />
                Statistics
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-white hover:text-[#019863] hover: bg-black/50">
                <Info className="w-4 h-4 mr-2 text-[#019863]" />
                About
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="ghost" size="sm" className="text-white hover:text-[#019863] hover: bg-black/50">
                <HelpCircle className="w-4 h-4 mr-2 text-[#019863]" />
                FAQ
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              className="text-white hover:bg-[#019863] border-[#019863] bg-transparent hover:border-transparent hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="w-full h-40 md:h-48 bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.4) 100%), url("/images/background.png")',
      }}>
        <div className="container mx-auto h-full flex items-end pb-6 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome to Dinner Tracker</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex-grow">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-[#FAFAF8] py-6 border-t border-[#E9DFCE]">
        <div className="container mx-auto text-center text-[#A18249] text-sm">
          <p>© 2025 Dinner Tracker. All rights reserved.</p>
        </div>
      </footer>

      <AddCoupleDialog open={isAddCoupleOpen} onOpenChange={setIsAddCoupleOpen} />
      <AddDinnerDateDialog open={isAddDinnerDateOpen} onOpenChange={setIsAddDinnerDateOpen} />
    </div>
  );
} 