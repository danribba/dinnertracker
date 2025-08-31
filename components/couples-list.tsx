'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { format, differenceInDays } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Type for what you use in the list/rendering
interface Couple {
  id: string;
  name: string;
  interval_months: number;
  latest_dinner_date: string | null;
}

// Types for data coming from Supabase
interface DinnerDate {
  date: string;
}

interface DinnerDateCouple {
  dinner_dates: DinnerDate;
}

interface CoupleWithDates {
  id: string;
  name: string;
  interval_months: number;
  dinner_date_couples: DinnerDateCouple[];
}

export function CouplesList() {
  const [couples, setCouples] = useState<Couple[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Convert to useCallback to use in useEffect deps
  const fetchCouplesWithLastDinner = useCallback(async () => {
    if (!user) return;

    try {
      // Get couples with their latest dinner date from dinner_date_couples
      const { data, error } = await supabase
        .from('couples')
        .select(`
          id,
          name,
          interval_months,
          dinner_date_couples!inner (
            dinner_dates (
              date
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const couplesData = data as unknown as CoupleWithDates[];

      // Process data to find the latest dinner date for each couple
      const processedCouples = couplesData.map(couple => {
        const dinnerDates = couple.dinner_date_couples
          .map(ddc => ddc.dinner_dates.date)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        return {
          id: couple.id,
          name: couple.name,
          interval_months: couple.interval_months,
          latest_dinner_date: dinnerDates[0] || null
        };
      });

      const today = new Date();
      const criticalCouples = processedCouples.filter(couple => {
        if (!couple.latest_dinner_date) return false;

        const lastDinnerDate = new Date(couple.latest_dinner_date);
        const daysSinceLastDinner = differenceInDays(today, lastDinnerDate);
        const intervalInDays = (couple.interval_months || 6) * 30;
        const shouldShow = daysSinceLastDinner > intervalInDays;

        console.log({
          coupleName: couple.name,
          lastDinner: format(lastDinnerDate, 'yyyy-MM-dd'),
          today: format(today, 'yyyy-MM-dd'),
          daysSince: daysSinceLastDinner,
          intervalDays: intervalInDays,
          shouldShow
        });

        return shouldShow;
      });

      setCouples(criticalCouples);
    } catch (err) {
      console.error('Error in fetchCouplesWithLastDinner:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchCouplesWithLastDinner();

    // Set up realtime subscription
    const channel = supabase.channel('couples_list_realtime');
    
    const subscription = channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dinner_dates',
        filter: `user_id=eq.${user.id}`
      }, () => fetchCouplesWithLastDinner())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dinner_date_couples',
        filter: `user_id=eq.${user.id}`
      }, () => fetchCouplesWithLastDinner())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'couples',
        filter: `user_id=eq.${user.id}`
      }, () => fetchCouplesWithLastDinner())
      .subscribe();

    // Cleanup
    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, [user, fetchCouplesWithLastDinner]);

  return (
    <div className="space-y-4">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : couples.length > 0 ? (
        <div className="grid gap-4">
          {couples.map((couple) => (
            <div
              key={couple.id}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border-2"
              style={{ borderColor: '#60432D' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{couple.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Latest dinner: {couple.latest_dinner_date &&
                      format(new Date(couple.latest_dinner_date), 'd MMM yyyy', { locale: enUS })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Intervall: {couple.interval_months || 6} months
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center">
          All caught up! No couples due for a dinner date right now.
        </p>
      )}
    </div>
  );
}
