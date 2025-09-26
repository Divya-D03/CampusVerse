
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
import { Loader2, Upload, BadgeHelp } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [step, setStep] = useState(1);
  const [srn, setSrn] = useState('');
  const [school, setSchool] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setStep(1);
    setSrn('');
    setSchool('');
    setPaymentMethod('upi');
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

  const handleNextStep = () => {
     if (!srn || !school) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Details',
        description: 'Please fill out your SRN and School to register.',
      });
      return;
    }
    const showPaymentSection = event?.registrationFee && event.registrationFee > 0;
    if(showPaymentSection){
        setStep(2);
    } else {
        handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (event?.registrationFee && event.registrationFee > 0) {
      if (!paymentMethod) {
        toast({
          variant: 'destructive',
          title: 'Payment Method Required',
          description: 'Please select a payment method.',
        });
        setIsSubmitting(false);
        return;
      }
      if (paymentMethod !== 'on-spot' && !transactionId) {
        toast({
          variant: 'destructive',
          title: 'Transaction ID Required',
          description: 'Please enter the payment reference or transaction ID.',
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Simulate API call and payment verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    onOpenChange(false);
    toast({
      title: 'Registration Submitted!',
      description: `Your registration for ${event?.title} has been received.`,
    });
    resetForm();
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Register for {event?.title}</DialogTitle>
              <DialogDescription>
                Please fill out the following information to complete your event registration.
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School/Department</Label>
                  <Select onValueChange={setSchool} value={school}>
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
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNextStep}>
                {event?.registrationFee && event.registrationFee > 0 ? 'Proceed to Payment' : 'Submit Registration'}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <TooltipProvider>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>
                Thank you for submitting your registration! To complete your registration, please provide your payment information below. This step is required to confirm your spot at the event.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label className="font-semibold text-base">1. Select Your Payment Method:</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">UPI</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex-1 cursor-pointer">Bank Transfer</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">Credit/Debit Card</Label>
                  </div>
                  {event?.status === 'On-Spot Registration' && (
                    <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                      <RadioGroupItem value="on-spot" id="on-spot" />
                      <Label htmlFor="on-spot" className="flex-1 cursor-pointer">On-spot Payment</Label>
                    </div>
                  )}
                </RadioGroup>
              </div>

              {paymentMethod !== 'on-spot' && (
                <>
                  <div className="space-y-3">
                     <Label htmlFor="transactionId" className="font-semibold text-base flex items-center gap-2">
                        2. Payment Reference Number
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <BadgeHelp className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>This helps us verify your payment.</p>
                            </TooltipContent>
                        </Tooltip>
                    </Label>
                    <Input
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter your transaction/reference ID"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="paymentProof" className="font-semibold text-base">3. Upload Proof of Payment</Label>
                    <Input
                      id="paymentProof"
                      type="file"
                      onChange={(e) => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                      className="file:text-primary file:font-bold file:mr-3"
                    />
                     <p className="text-xs text-muted-foreground">
                       (Optional but recommended) Upload a screenshot or PDF of your payment confirmation.
                    </p>
                  </div>
                </>
              )}
                <div className="bg-muted/50 p-3 rounded-md border text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">💡 Note:</span> Please ensure your payment is completed before submitting. If you chose "On-spot Payment", your registration will be confirmed after payment at the venue.
                </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : 'Submit Registration'}
              </Button>
            </DialogFooter>
          </TooltipProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
