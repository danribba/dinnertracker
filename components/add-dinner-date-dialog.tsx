'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddDinnerDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Couple {
  id: string;
  name: string;
  user_id: string;
}

export function AddDinnerDateDialog({ open, onOpenChange, onSuccess }: AddDinnerDateDialogProps) {
  const [couples, setCouples] = useState<Couple[]>([]);
  const [selectedCouples, setSelectedCouples] = useState<Couple[]>([]);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [menu, setMenu] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCouples = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('couples')
        .select('id, name, user_id')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching couples:', error);
        setError(error.message);
        return;
      }
      
      setCouples(data || []);
    };

    if (open) {
      fetchCouples();
      // Reset form when dialog opens
      setSelectedCouples([]);
      setDate('');
      setLocation('');
      setMenu('');
      setNotes('');
      setError(null);
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to add a dinner date');
      return;
    }

    if (selectedCouples.length === 0) {
      setError('Please select at least one couple');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    if (!location) {
      setError('Please select a location');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Insert dinner date
      const { data: dinnerDate, error: dinnerError } = await supabase
        .from('dinner_dates')
        .insert({
          date,
          location: location.toLowerCase(),
          menu: menu.trim() || null,
          notes: notes.trim() || null,
          user_id: user.id
        })
        .select()
        .single();

      if (dinnerError) throw dinnerError;

      // Insert dinner date couples
      const dinnerDateCouples = selectedCouples.map(couple => ({
        dinner_date_id: dinnerDate.id,
        couple_id: couple.id,
        user_id: user.id
      }));

      const { error: couplesError } = await supabase
        .from('dinner_date_couples')
        .insert(dinnerDateCouples);

      if (couplesError) throw couplesError;

      toast({
        title: "Success",
        description: "Dinner date added successfully",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Clear form and close dialog on success
      setSelectedCouples([]);
      setDate('');
      setLocation('');
      setMenu('');
      setNotes('');
      onOpenChange(false);
    } catch (err) {
      console.error('Error adding dinner date:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding the dinner date');
    } finally {
      setIsLoading(false);
    }
  };

  const availableCouples = couples.filter(
    couple => !selectedCouples.some(selected => selected.id === couple.id)
  );

  const removeCouple = (coupleId: string) => {
    setSelectedCouples(current => current.filter(c => c.id !== coupleId));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setSearchOpen(false);
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Dinner</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Selected Couples</Label>
            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
              {selectedCouples.map((couple) => (
                <div
                  key={couple.id}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span className="text-sm">{couple.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeCouple(couple.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="relative">
              <Popover 
                open={searchOpen} 
                onOpenChange={setSearchOpen}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={searchOpen}
                    className="w-full justify-between"
                    type="button"
                  >
                    <span>Add couple/s...</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[calc(100vw-2rem)] sm:w-[450px] p-0"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <Command>
                    <CommandInput placeholder="Search couples..." />
                    <CommandEmpty>No couples found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                      {availableCouples.map((couple) => (
                        <CommandItem
                          key={couple.id}
                          onSelect={() => {
                            setSelectedCouples(current => [...current, couple]);
                            setSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCouples.some(c => c.id === couple.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {couple.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="away">Away</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="menu">Menu</Label>
            <Input
              id="menu"
              placeholder="What's for dinner?"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special notes about the dinner..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Dinner Date'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}