'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { createEvent } from '@/ai/flows/create-event';
import { generateEventDescription } from '@/ai/flows/generate-event-description';
import { useAuth } from '@/contexts/auth-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventCategory } from '@/lib/types';

interface HostEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventCategories: { value: EventCategory, label: string }[] = [
    { value: 'cultural', label: 'Cultural' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'ideathon', label: 'Ideathon' },
    { value: 'project-expo', label: 'Project Expo' },
    { value: 'club', label: 'Club' },
    { value: 'tech', label: 'Tech Workshop' },
];

export function HostEventDialog({ open, onOpenChange }: HostEventDialogProps) {
  const { addCoinTransaction, addEvent } = useAuth();
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [coins, setCoins] = useState('');
  const [category, setCategory] = useState<EventCategory | ''>('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleGenerateDescription = async () => {
    if (!title || !keywords) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter a title and some keywords to generate a description.',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateEventDescription({ title, keywords });
      setDescription(result.description);
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate an event description. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !date || !coins || !category) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Form',
        description: 'Please fill out all the fields, including category, to create the event.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const coinAmount = parseInt(coins, 10);
      const newEventId = `evt-${Date.now()}`;
      
      await createEvent({
        title,
        description,
        date,
        coins: coinAmount,
        category,
      });

      addEvent({
        id: newEventId,
        title,
        description,
        date,
        coins: coinAmount,
        status: 'Available',
        imageId: `new-event-${Math.floor(Math.random() * 5) + 1}`, // Assign a random placeholder image
        category,
      });
      
      addCoinTransaction({
        reason: `Hosted event: ${title}`,
        amount: 10, // Award 10 coins for hosting an event
        type: 'earned',
      });

      toast({
        title: 'Event Created Successfully!',
        description: `${title} is now live. You've earned 10 coins for hosting!`,
      });
      
      // Reset form and close dialog
      onOpenChange(false);
      setTitle('');
      setKeywords('');
      setDescription('');
      setDate('');
      setCoins('');
      setCategory('');

    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: 'destructive',
        title: 'Event Creation Failed',
        description: 'There was an error creating your event. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md neumorphic-flat">
        <DialogHeader>
          <DialogTitle>Host a New Event</DialogTitle>
          <DialogDescription>
            Fill in the details below to create your event.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Code & Coffee" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., coding, web dev, morning" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Description</Label>
              <Button onClick={handleGenerateDescription} variant="outline" size="sm" disabled={isGenerating} className="neumorphic-raised-interactive">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span className="ml-2">Generate with AI</span>
              </Button>
            </div>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe your event..." 
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Event Category</Label>
            <Select onValueChange={(value) => setCategory(value as EventCategory)} value={category}>
                <SelectTrigger id="category" className="neumorphic-pressed">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="neumorphic-flat">
                    {eventCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g., December 25, 2024" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="coins">Coin Prize</Label>
              <Input id="coins" type="number" value={coins} onChange={(e) => setCoins(e.target.value)} placeholder="e.g., 50" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="neumorphic-raised-interactive">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="neumorphic-raised-interactive">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Event...
              </>
            ) : (
              'Create Event'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
