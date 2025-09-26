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
import { Loader2, Coins, AlertCircle, ArrowLeft, Upload } from 'lucide-react';
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

type PaymentMethod = 'upi' | 'bank';

export function RegistrationDialog({ event, open, onOpenChange }: RegistrationDialogProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [srn, setSrn] = useState('');
  const [school, setSchool] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const registrationFee = event?.registrationFee || 0;

  const resetForm = () => {
    setStep(1);
    setSrn('');
    setSchool('');
    setPaymentMethod(null);
    setTransactionId('');
    setPaymentProof(null);
    setIsSubmitting(false);
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleDetailsSubmit = () => {
    if (!srn || !school) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Details',
        description: 'Please fill out your SRN and School to continue.',
      });
      return;
    }
    if (registrationFee > 0) {
      setStep(2);
    } else {
      // If event is free, submit directly
      handleSubmit();
    }
  };

  const handlePaymentSubmit = () => {
    if (!paymentMethod || !transactionId) {
      toast({
        variant: 'destructive',
        title: 'Payment Details Incomplete',
        description: 'Please select a payment method and enter the transaction ID.',
      });
      return;
    }
    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    onOpenChange(false);
    toast({
      title: 'Registration Successful!',
      description: `You have successfully registered for ${event?.title}.`,
    });
    resetForm();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPaymentProof(event.target.files[0]);
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {step === 1 && (
          <>
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
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleDetailsSubmit} disabled={isSubmitting}>
                {registrationFee > 0 ? 'Next' : 'Register'}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
           <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                 <button onClick={() => setStep(1)} className="p-1 rounded-full hover:bg-muted"><ArrowLeft className="w-4 h-4" /></button>
                Payment Details
              </DialogTitle>
              <DialogDescription>
                Complete the payment to finalize your registration for {event?.title}.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
                <div className="bg-muted/50 p-4 rounded-md border flex justify-between items-center">
                    <p className="font-semibold text-base">Registration Fee</p>
                    <p className="text-lg font-bold text-primary">₹{registrationFee}</p>
                </div>
                
                <div className="space-y-2">
                    <Label>Select Payment Method</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                            onClick={() => setPaymentMethod('upi')}
                            className="neumorphic-raised-interactive"
                        >
                            UPI
                        </Button>
                        <Button
                            variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                            onClick={() => setPaymentMethod('bank')}
                            className="neumorphic-raised-interactive"
                        >
                            Bank Transfer
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input
                        id="transactionId"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter the ID from your payment app"
                        disabled={isSubmitting}
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="payment-proof">Payment Proof (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="payment-proof" type="file" onChange={handleFileChange} className="flex-1"/>
                      <Button variant="outline" size="icon" asChild>
                        <label htmlFor="payment-proof" className="cursor-pointer">
                          <Upload className="w-4 h-4"/>
                        </label>
                      </Button>
                    </div>
                    {paymentProof && <p className="text-xs text-muted-foreground">File: {paymentProof.name}</p>}
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md border">
                    To be eligible for prizes, you must submit your project and provide proof of payment.
                </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={handlePaymentSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit Registration'}
              </Button>
            </DialogFooter>
           </>
        )}
      </DialogContent>
    </Dialog>
  );
}
