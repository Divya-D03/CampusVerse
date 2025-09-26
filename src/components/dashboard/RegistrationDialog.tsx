
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
import { CreditCard, Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';

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
  const [srn, setSrn] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [school, setSchool] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleNextStep = () => {
    const semesterNumber = parseInt(semester, 10);
    if (!srn || !course || !semester || !school) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Form',
        description: 'Please fill out all the fields to register.',
      });
      return;
    }
    
    if (isNaN(semesterNumber) || semesterNumber < 1 || semesterNumber > 8) {
      toast({
        variant: 'destructive',
        title: 'Invalid Semester',
        description: 'Please enter a semester between 1 and 8.',
      });
      return;
    }

    if (event?.registrationFee && event.registrationFee > 0) {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handlePaymentAndSubmit = async () => {
    // Simulate payment processing
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // In a real app, you would handle payment submission here.
    toast({
      title: 'Payment Method Added',
      description: 'Redirecting to confirm your registration...',
    });
    await handleSubmit();
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    onOpenChange(false);
    setStep(1); // Reset to first step for next time
    toast({
      title: 'Registration Successful!',
      description: `You have successfully registered for ${event?.title}.`,
    });
    // Reset form
    setSrn('');
    setCourse('');
    setSemester('');
    setSchool('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when dialog is closed
      setStep(1);
      setSrn('');
      setCourse('');
      setSemester('');
      setSchool('');
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {event?.title}</DialogTitle>
           <DialogDescription>
            {step === 1 ? 'Please fill in your details to proceed.' : 'Complete your payment to finalize registration.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="grid gap-4 py-4">
            {event?.registrationFee && event.registrationFee > 0 && (
               <div className="text-sm p-3 rounded-lg bg-muted border">
                  <p className="font-bold">Registration Fee: <span className="text-primary">{event.registrationFee} coins</span></p>
                </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="srn" className="text-right">
                SRN
              </Label>
              <Input
                id="srn"
                value={srn}
                onChange={(e) => setSrn(e.target.value)}
                className="col-span-3"
                placeholder="Your Student Registration Number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Input
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="col-span-3"
                placeholder="e.g., CSE, AIDS"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="semester" className="text-right">
                Semester
              </Label>
              <Input
                id="semester"
                type="number"
                min="1"
                max="8"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 5"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="school" className="text-right">
                School
              </Label>
              <Select onValueChange={setSchool} value={school}>
                <SelectTrigger className="col-span-3">
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
        )}
        
        {step === 2 && (
            <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">To complete your registration, please add a payment method. After adding your payment details, you will be redirected to the payment page to confirm your order.</p>
                <Separator />
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <h3 className="font-semibold">Pay with Coins</h3>
                    <p className="text-2xl font-bold text-yellow-400">{event?.registrationFee} Coins</p>
                    <Button onClick={handlePaymentAndSubmit} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Add Payment Method
                          </>
                        )}
                    </Button>
                </div>
            </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          {step === 1 && (
             <Button onClick={handleNextStep} disabled={isSubmitting}>
                {event?.registrationFee && event.registrationFee > 0 ? 'Proceed to Payment' : (
                   isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : 'Register Now'
                )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
