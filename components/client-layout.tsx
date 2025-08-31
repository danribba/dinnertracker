'use client';

import { AuthenticatedLayout } from '@/components/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <AuthenticatedLayout>
      {children}
    </AuthenticatedLayout>
  );
} 