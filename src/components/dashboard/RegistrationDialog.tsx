
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  const [paymentMethod, setPaymentMethod] = useState('card');
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
      title: 'Redirecting to Payment',
      description: 'You will be redirected to a secure payment page to finalize your payment.',
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
    setPaymentMethod('card');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when dialog is closed
      setStep(1);
      setSrn('');
      setCourse('');
      setSemester('');
      setSchool('');
      setPaymentMethod('card');
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
            <div className="space-y-6 py-4">
                <div>
                    <h3 className="font-semibold text-lg">Step 2: Payment</h3>
                    <p className="text-sm text-muted-foreground">Please select your preferred payment method to complete your registration.</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 text-center p-4 border rounded-lg">
                    <p className="text-lg">Total Amount</p>
                    <p className="text-3xl font-bold text-yellow-400">{event?.registrationFee} Coins</p>
                </div>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    <Label className='font-semibold'>Choose a payment method:</Label>
                    <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                    </div>
                     <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="flex-1 cursor-pointer">Other options...</Label>
                    </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground text-center">
                    By clicking Continue, you'll be redirected to a secure payment page to finalize your payment.
                </p>
            </div>
        )}

        <DialogFooter>
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
              Back
            </Button>
          )}
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

          {step === 2 && (
              <Button onClick={handlePaymentAndSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Payment
                    </>
                  )}
              </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
