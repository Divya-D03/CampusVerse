'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Gift, Coins } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <Gift className="w-8 h-8 text-primary" />
            Welcome to CampusVerse!
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-base pt-4">
              As a welcome gift, you've been awarded
              <span className="font-bold text-primary mx-1">50 free coins!</span>
              <br />
              <br />
              <div className="p-3 rounded-md bg-muted/50 border">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>5 Coins = 1 Rupee</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Participate in events to win more coins and redeem exciting rewards.</p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Let's Go!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
