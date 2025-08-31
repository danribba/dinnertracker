'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">


      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center mb-4">
              <Utensils className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-center">About Dinner Tracker</h1>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-sm border-2 space-y-6" style={{ borderColor: '#60432D' }}>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Our Story</h2>
              <p className="text-gray-600">
                Dinner Tracker is a simple way to keep track of your dinner dates with friends and family. 
                Never forget whose turn it is to host or how long it's been since you've had dinner with someone.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Features</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Track dinner dates with couples</li>
                <li>See who you haven't had dinner with in a while</li>
                <li>Record menus and notes for each dinner</li>
                <li>Get reminders when it's been too long</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Contact</h2>
              <p className="text-gray-600">
                Have questions or suggestions? We'd love to hear from you. 
                Reach out to us at info@dinnertracker.com  
              </p>
              <Link href="/" className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-black hover:text-white/80">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="font-semibold">Back</span>
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}