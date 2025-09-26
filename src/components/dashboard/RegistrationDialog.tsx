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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Event } from '@/lib/types';
import { Loader2, Coins, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface RegistrationDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schools = [
  'School of Computer Science and Engineering',
  'School of CSIT',
  'School of Electronics and Communication Engineering',
  'School of Mechanical Engineering',
  'School of Civil Engineering',
  'School of Electrical and Electronics Engineering',
  'School of Architecture',
  'School of Arts, Design and Performing Arts',
  'School of Commerce and Management',
  'School of Law',
];

export function RegistrationDialog({ event, open, onOpenChange }: RegistrationDialogProps) {
  const { user, deductCoinsForRegistration } = useAuth();
  const [srn, setSrn] = useState('');
  const [school, setSchool] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const registrationFee = event?.registrationFee || 0;
  const hasEnoughCoins = user ? user.coins >= registrationFee : false;

  const resetForm = () => {
    setSrn('');
    setSchool('');
    setIsSubmitting(false);
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async () => {
     if (!srn || !school) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Details',
        description: 'Please fill out your SRN and School to register.',
      });
      return;
    }

    if (!hasEnoughCoins && registrationFee > 0) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Coins',
        description: `You need ${registrationFee} coins to register for this event.`,
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (registrationFee > 0) {
      deductCoinsForRegistration(registrationFee, event?.title || 'Event Registration');
    }

    setIsSubmitting(false);
    onOpenChange(false);
    toast({
      title: 'Registration Successful!',
      description: `You have successfully registered for ${event?.title}.`,
    });
    resetForm();
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register for {event?.title}</DialogTitle>
          <DialogDescription>
            Please fill out your information to join the event.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="srn">Student Registration Number (SRN)</Label>
              <Input
                id="srn"
                value={srn}
                onChange={(e) => setSrn(e.target.value)}
                placeholder="Enter your unique SRN"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School/Department</Label>
              <Select onValueChange={setSchool} value={school} disabled={isSubmitting}>
                <SelectTrigger id="school">
                  <SelectValue placeholder="Select your school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {registrationFee > 0 && (
             <div className="bg-muted/50 p-4 rounded-md border flex flex-col gap-2">
              <div className='flex justify-between items-center'>
                 <p className="font-semibold text-base">Registration Fee</p>
                 <div className="flex items-center gap-2 text-lg font-bold text-yellow-400">
                    <Coins className="w-5 h-5" />
                    {registrationFee}
                </div>
              </div>
               {!hasEnoughCoins && (
                  <div className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <p>You have insufficient coins. Participate in other events to earn more.</p>
                  </div>
                )}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md border">
            <span className="font-bold text-foreground">Note on Prizes:</span> To be eligible for prizes, you must submit your project or task as per the event guidelines.
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || (!hasEnoughCoins && registrationFee > 0)}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : 'Submit Registration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
