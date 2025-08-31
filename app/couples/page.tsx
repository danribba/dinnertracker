'use client';

import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth-form';
import { CouplesContent } from '@/components/couples-content';

export default function CouplesPage() {
  const { user } = useAuth();

  if (!user) {
    return <AuthForm />;
  }

  return <CouplesContent />;
} 