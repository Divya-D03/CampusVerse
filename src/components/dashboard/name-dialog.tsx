'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface NameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NameDialog({ open, onOpenChange }: NameDialogProps) {
  const [name, setName] = useState('');
  const { updateUserName, markFirstLoginDone } = useAuth();

  const handleContinue = () => {
    if (name.trim()) {
      updateUserName(name.trim());
      markFirstLoginDone();
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <UserPlus className="w-8 h-8 text-primary" />
            What should we call you?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-base pt-4">
              Please enter your name. This will be displayed across the app.
              <div className="mt-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleContinue} disabled={!name.trim()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
