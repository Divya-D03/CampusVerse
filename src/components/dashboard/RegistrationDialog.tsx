
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
import { Loader2, UploadCloud } from 'lucide-react';
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
  const [school, setSchool] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setSrn('');
    setSchool('');
    setPaymentMethod('upi');
    setTransactionId('');
    setPaymentProof(null);
    setIsSubmitting(false);
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

    if (event?.registrationFee && event.registrationFee > 0) {
      if (!paymentMethod) {
        toast({
          variant: 'destructive',
          title: 'Payment Method Required',
          description: 'Please select a payment method.',
        });
        return;
      }
      if (paymentMethod !== 'on-spot' && !transactionId) {
        toast({
          variant: 'destructive',
          title: 'Transaction ID Required',
          description: 'Please enter the payment reference or transaction ID.',
        });
        return;
      }
    }

    setIsSubmitting(true);
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const showPaymentSection = event?.registrationFee && event.registrationFee > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register for {event?.title}</DialogTitle>
          <DialogDescription>
            Please fill out the following information to complete your event registration.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Registration Details */}
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

          {/* Payment Details */}
          {showPaymentSection && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Payment Details</h3>
              <p className="text-sm text-muted-foreground">
                Make sure your payment is completed before submitting this form. The registration fee is <span className='font-bold text-primary'>{event.registrationFee} coins</span>.
              </p>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                <Label className="font-semibold">Payment Options:</Label>
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
                <div className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:border-primary">
                  <RadioGroupItem value="on-spot" id="on-spot" />
                  <Label htmlFor="on-spot" className="flex-1 cursor-pointer">On-spot Payment</Label>
                </div>
              </RadioGroup>

              {paymentMethod !== 'on-spot' && (
                <div className="space-y-2">
                  <Label htmlFor="transactionId">Payment Reference/Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction ID"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="paymentProof">Upload Payment Proof (Optional)</Label>
                <Input
                  id="paymentProof"
                  type="file"
                  onChange={(e) => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                  className="file:text-primary file:font-bold"
                />
                 <p className="text-xs text-muted-foreground">
                  (Recommended) Upload a screenshot or PDF of your payment confirmation.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
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
      </DialogContent>
    </Dialog>
  );
}
