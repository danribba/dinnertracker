'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, Calendar, MapPin, Utensils, StickyNote, History, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditDinnerDateDialog } from './edit-dinner-date-dialog';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface Couple {
  id: string;
  name: string;
}

interface DinnerDateCouple {
  couples: Couple[];
}

interface DinnerDate {
  id: string;
  date: string;
  location: string;
  menu: string;
  notes: string;
  couples: Couple[];
  dinner_date_couples: DinnerDateCouple[];
}

interface MenuHistory {
  [coupleId: string]: string[];
}

export function DinnerDatesList() {
  const [dinnerDates, setDinnerDates] = useState<DinnerDate[]>([]);
  const [menuHistory, setMenuHistory] = useState<MenuHistory>({});
  const [error, setError] = useState<string | null>(null);
  const [couples, setCouples] = useState<Couple[]>([]);
  const [selectedCoupleId, setSelectedCoupleId] = useState<string>('all');
  const [filteredDinnerDates, setFilteredDinnerDates] = useState<DinnerDate[]>([]);
  const [editingDinnerId, setEditingDinnerId] = useState<string | null>(null);
  const [deletingDinnerId, setDeletingDinnerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDinnerDates = useCallback(async () => {
    if (!user) return;

    try {
      const { data: dates, error } = await supabase
        .from('dinner_dates')
        .select(`
          id,
          date,
          location,
          menu,
          notes,
          dinner_date_couples (
            couples (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform data to match DinnerDate interface
      const transformedDates: DinnerDate[] = dates.map(date => ({
        id: date.id,
        date: date.date,
        location: date.location,
        menu: date.menu,
        notes: date.notes,
        couples: date.dinner_date_couples.map(ddc => ddc.couples).flat(),
        dinner_date_couples: date.dinner_date_couples
      }));

      setDinnerDates(transformedDates);

      // Process menu history
      const history: MenuHistory = {};
      transformedDates.forEach(date => {
        if (date.menu) {
          date.couples.forEach(couple => {
            if (!history[couple.id]) {
              history[couple.id] = [];
            }
            if (!history[couple.id].includes(date.menu)) {
              history[couple.id].push(date.menu);
            }
          });
        }
      });
      setMenuHistory(history);
    } catch (err) {
      console.error('Error fetching dinner dates:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }, [user]);

  const fetchCouples = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('couples')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error fetching couples:', error);
        return;
      }

      setCouples(data || []);
    } catch (err) {
      console.error('Error fetching couples:', err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchDinnerDates();
    fetchCouples();

    // Set up realtime subscription
    const channel = supabase.channel('dinner_dates_realtime');
    
    const subscription = channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dinner_dates',
        filter: `user_id=eq.${user.id}`
      }, () => fetchDinnerDates())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dinner_date_couples',
        filter: `user_id=eq.${user.id}`
      }, () => fetchDinnerDates())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'couples',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchCouples();
        fetchDinnerDates();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, [user, fetchDinnerDates, fetchCouples]);

  useEffect(() => {
    if (selectedCoupleId === 'all') {
      setFilteredDinnerDates(dinnerDates);
    } else {
      setFilteredDinnerDates(
        dinnerDates.filter(date =>
          date.couples.some(couple => couple.id === selectedCoupleId)
        )
      );
    }
  }, [selectedCoupleId, dinnerDates]);

  const handleDelete = async () => {
    if (!user || !deletingDinnerId) return;
    setIsDeleting(true);

    try {
      const { error: deleteError } = await supabase
        .from('dinner_dates')
        .delete()
        .eq('id', deletingDinnerId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Dinner date deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting dinner date:', err);
      toast({
        title: "Error",
        description: "Failed to delete dinner date",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingDinnerId(null);
    }
  };

  const MenuHistoryButton = ({ coupleId }: { coupleId: string }) => {
    const history = menuHistory[coupleId] || [];
    if (history.length === 0) return null;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <History className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Previous menus:</h4>
            <ul className="text-sm space-y-1">
              {history.map((menu, index) => (
                <li key={index} className="text-muted-foreground">• {menu}</li>
              ))}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div>
      {/* Filter dropdown */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedCoupleId} onValueChange={setSelectedCoupleId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by couple" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All couples</SelectItem>
            {couples.map((couple) => (
              <SelectItem key={couple.id} value={couple.id}>
                {couple.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-3">
        {filteredDinnerDates.map((dinnerDate) => (
          <div key={dinnerDate.id} className="bg-card border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                {dinnerDate.couples.map((couple) => (
                  <span key={couple.id} className="font-medium text-sm block">
                    {couple.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                {dinnerDate.menu && dinnerDate.couples.map(couple => (
                  <MenuHistoryButton key={couple.id} coupleId={couple.id} />
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setEditingDinnerId(dinnerDate.id)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingDinnerId(dinnerDate.id)}
                  className="h-7 w-7"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{format(new Date(dinnerDate.date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{dinnerDate.location}</span>
                </div>
              </div>
              {dinnerDate.menu && (
                <div className="flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{dinnerDate.menu}</span>
                </div>
              )}
              {dinnerDate.notes && (
                <div className="flex items-center gap-2">
                  <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{dinnerDate.notes}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 text-sm font-medium">Date</th>
              <th className="text-left py-2 px-4 text-sm font-medium">Couples</th>
              <th className="text-left py-2 px-4 text-sm font-medium">Location</th>
              <th className="text-left py-2 px-4 text-sm font-medium">Menu</th>
              <th className="text-left py-2 px-4 text-sm font-medium">Notes</th>
              <th className="text-right py-2 px-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDinnerDates.map((dinnerDate) => (
              <tr key={dinnerDate.id} className="border-b last:border-0 hover:bg-accent/50">
                <td className="py-2 px-4 text-sm">
                  {format(new Date(dinnerDate.date), 'MMM d, yyyy')}
                </td>
                <td className="py-2 px-4 text-sm">
                  <div className="space-y-1">
                    {dinnerDate.couples.map((couple) => (
                      <span key={couple.id} className="block">
                        {couple.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 text-sm">{dinnerDate.location}</td>
                <td className="py-2 px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{dinnerDate.menu || '-'}</span>
                    {dinnerDate.menu && dinnerDate.couples.map(couple => (
                      <MenuHistoryButton key={couple.id} coupleId={couple.id} />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 text-sm">{dinnerDate.notes || '-'}</td>
                <td className="py-2 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingDinnerId(dinnerDate.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingDinnerId(dinnerDate.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredDinnerDates.length === 0 && !error && (
        <p className="text-center text-muted-foreground py-4 text-xs md:text-sm">
          No dinner dates recorded yet.
        </p>
      )}
      {error && (
        <div className="bg-destructive/10 text-destructive text-xs md:text-sm p-2 rounded-md mt-2">
          {error}
        </div>
      )}

      <EditDinnerDateDialog
        open={!!editingDinnerId}
        onOpenChange={(open) => !open && setEditingDinnerId(null)}
        dinnerId={editingDinnerId}
      />

      <AlertDialog open={!!deletingDinnerId} onOpenChange={(open) => !open && setDeletingDinnerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the dinner date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}