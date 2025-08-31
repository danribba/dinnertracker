'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Couple {
  id: string;
  name: string;
  last_dinner_date: string | null;
  interval_months: number;
}

export function CouplesContent() {
  const [couples, setCouples] = useState<Couple[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingCouple, setEditingCouple] = useState<Couple | null>(null);
  const [editName, setEditName] = useState('');
  const [editInterval, setEditInterval] = useState<string>('6');
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchCouples();
  }, [user]);

  const fetchCouples = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('couples')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCouples(data || []);
    } catch (err) {
      console.error('Error fetching couples:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('couples')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Couple removed",
        description: "The couple has been removed from your list.",
      });

      fetchCouples();
    } catch (err) {
      console.error('Error deleting couple:', err);
      toast({
        title: "Error",
        description: "Could not remove the couple. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (couple: Couple) => {
    setEditingCouple(couple);
    setEditName(couple.name);
    setEditInterval(couple.interval_months?.toString() || '6');
  };

  const handleSaveEdit = async () => {
    if (!user || !editingCouple) return;

    try {
      const { error } = await supabase
        .from('couples')
        .update({ 
          name: editName,
          interval_months: parseInt(editInterval)
        })
        .eq('id', editingCouple.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Couple updated",
        description: "The couple's information has been updated.",
      });

      setEditingCouple(null);
      fetchCouples();
    } catch (err) {
      console.error('Error updating couple:', err);
      toast({
        title: "Error",
        description: "Could not update the couple. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-sm border-2" style={{ borderColor: '#60432D' }}>
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/')}
            className="hover:bg-black/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Manage Couples</h1>
        </div>
        <div className="overflow-x-auto text-xs md:text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Interval (months)</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {couples.map((couple) => (
                <tr key={couple.id} className="border-b last:border-0">
                  <td className="py-3 px-4">{couple.name}</td>
                  <td className="py-3 px-4">{couple.interval_months || 6}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(couple)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(couple.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editingCouple} onOpenChange={(open) => !open && setEditingCouple(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Couple</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval">Interval (months)</Label>
              <Select value={editInterval} onValueChange={setEditInterval}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveEdit} className="w-full">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 