'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';

interface Stats {
  totalDinners: number;
  mostFrequentCouple: {
    name: string;
    count: number;
  } | null;
  mostCommonLocation: {
    location: string;
    count: number;
  } | null;
  averageDaysInterval: number | null;
  lastDinnerDate: string | null;
}

interface CoupleData {
  couple: Array<{ name: string }>;
}

export default function Stats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalDinners: 0,
    mostFrequentCouple: null,
    mostCommonLocation: null,
    averageDaysInterval: null,
    lastDinnerDate: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Get total number of dinner dates
        const { data: dinnerDates, error: dinnerError } = await supabase
          .from('dinner_dates')
          .select('id, date, location')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (dinnerError) throw dinnerError;

        // Get most frequent couple
        const { data: coupleStats, error: coupleError } = await supabase
          .from('dinner_date_couples')
          .select(`
            couple:couples (
              name
            )
          `)
          .eq('user_id', user.id);

        if (coupleError) throw coupleError;

        // Log data structure for debugging
        console.log('Couple stats data structure:', coupleStats?.[0]);

        // Process stats
        const totalDinners = dinnerDates?.length || 0;
        const lastDinnerDate = dinnerDates?.[0]?.date || null;

        // Calculate most common location
        const locationCounts = dinnerDates?.reduce((acc: Record<string, number>, curr) => {
          acc[curr.location] = (acc[curr.location] || 0) + 1;
          return acc;
        }, {});

        const mostCommonLocation = locationCounts ? 
          Object.entries(locationCounts)
            .sort(([,a], [,b]) => b - a)[0] : null;

        // Calculate most frequent couple
        const coupleCounts = (coupleStats || []).reduce<Record<string, number>>((acc, curr) => {
          if (curr.couple && Array.isArray(curr.couple) && curr.couple[0] && curr.couple[0].name) {
            const coupleName = curr.couple[0].name;
            acc[coupleName] = (acc[coupleName] || 0) + 1;
          }
          return acc;
        }, {});

        const mostFrequentCouple = Object.entries(coupleCounts).length > 0 ?
          Object.entries(coupleCounts)
            .sort(([,a], [,b]) => b - a)[0] : null;

        // Calculate average days between dinners
        let averageDaysInterval = null;
        if (dinnerDates && dinnerDates.length > 1) {
          const sortedDates = dinnerDates
            .map(d => new Date(d.date))
            .sort((a, b) => a.getTime() - b.getTime());
          
          const totalDays = (sortedDates[sortedDates.length - 1].getTime() - sortedDates[0].getTime()) / (1000 * 60 * 60 * 24);
          averageDaysInterval = Math.round(totalDays / (sortedDates.length - 1));
        }

        setStats({
          totalDinners,
          mostFrequentCouple: mostFrequentCouple ? {
            name: mostFrequentCouple[0],
            count: mostFrequentCouple[1]
          } : null,
          mostCommonLocation: mostCommonLocation ? {
            location: mostCommonLocation[0],
            count: mostCommonLocation[1]
          } : null,
          averageDaysInterval,
          lastDinnerDate
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-black/90 backdrop-blur-sm text-white w-full h-16 sticky top-0 z-50">
        <div className="container mx-auto h-full px-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-semibold">Back</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center mb-4">
              <BarChart2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-center">Dinner Statistics</h1>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-sm border-2 space-y-8" style={{ borderColor: '#60432D' }}>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading statistics...</p>
            ) : error ? (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Total Dinner Dates</h3>
                    <p className="text-3xl font-bold">{stats.totalDinners}</p>
                  </div>

                  {stats.lastDinnerDate && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Last Dinner</h3>
                      <p className="text-3xl font-bold">
                        {format(new Date(stats.lastDinnerDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}

                  {stats.mostFrequentCouple && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Most Frequent Dinner Guests</h3>
                      <p className="text-3xl font-bold">{stats.mostFrequentCouple.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.mostFrequentCouple.count} dinner{stats.mostFrequentCouple.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {stats.mostCommonLocation && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Most Common Location</h3>
                      <p className="text-3xl font-bold capitalize">{stats.mostCommonLocation.location}</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.mostCommonLocation.count} dinner{stats.mostCommonLocation.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {stats.averageDaysInterval !== null && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Average Days Between Dinners</h3>
                      <p className="text-3xl font-bold">{stats.averageDaysInterval}</p>
                      <p className="text-sm text-muted-foreground">days</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}