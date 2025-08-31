'use client';

import { DinnerDatesOverview } from '@/components/dinner-dates-overview';
import { AuthForm } from '@/components/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { LandingPage } from '@/components/LandingPage';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <LandingPage />;
  }

  return <DinnerDatesOverview />;
}