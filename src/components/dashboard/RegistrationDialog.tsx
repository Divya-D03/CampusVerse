'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import { Loader2, ArrowLeft, Upload, Check, Copy } from 'lucide-react';
import { UpiApps } from '../ui/upi-icons';
import { cn } from '@/lib/utils';

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

type UpiApp = 'paytm' | 'phonepe' | 'gpay';
type PaymentMethod = 'upi' | 'bank';

const UPI_ID = "campusverse@reva.edu.in";

export function RegistrationDialog({ event, open, onOpenChange }: RegistrationDialogProps) {
  const [step, setStep] = useState(1);
  const [srn, setSrn] = useState('');
  const [school, setSchool] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<UpiApp | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const registrationFee = event?.registrationFee || 0;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}&pn=CampusVerse&am=${registrationFee}&cu=INR&tn=Registration%20for%20${encodeURIComponent(event?.title || "")}`;


  const resetForm = () => {
    setStep(1);
    setSrn('');
    setSchool('');
    setPaymentMethod('upi');
    setSelectedUpiApp(null);
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
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (registrationFee > 0 && (!transactionId)) {
       toast({
        variant: 'destructive',
        title: 'Payment Details Incomplete',
        description: 'Please enter the transaction ID.',
      });
      return;
    }
    
    setIsSubmitting(true);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast({
      title: 'Copied to Clipboard!',
      description: 'UPI ID has been copied.',
    });
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
                  <Input id="srn" value={srn} onChange={(e) => setSrn(e.target.value)} placeholder="Enter your unique SRN" disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School/Department</Label>
                  <Select onValueChange={setSchool} value={school} disabled={isSubmitting}>
                    <SelectTrigger id="school"><SelectValue placeholder="Select your school" /></SelectTrigger>
                    <SelectContent>{schools.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={handleDetailsSubmit} disabled={isSubmitting}>
                {registrationFee > 0 ? 'Proceed to Payment' : 'Register for Free'}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
           <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                 <button onClick={() => setStep(1)} className="p-1 rounded-full hover:bg-muted disabled:opacity-50" disabled={isSubmitting}><ArrowLeft className="w-4 h-4" /></button>
                Complete Your Payment
              </DialogTitle>
              <DialogDescription>To finalize your registration for {event?.title}, please complete the payment.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
                <div className="bg-muted/50 p-4 rounded-md border flex justify-between items-center">
                    <p className="font-semibold text-base">Registration Fee</p>
                    <p className="text-lg font-bold text-primary">₹{registrationFee}</p>
                </div>
                
                <div className="space-y-4">
                    <Label>Select Payment Method</Label>
                    <div className="grid grid-cols-3 gap-2">
                       { (['paytm', 'phonepe', 'gpay'] as UpiApp[]).map(app => (
                          <button key={app} onClick={() => setSelectedUpiApp(app)}
                            className={cn(
                              "neumorphic-raised-interactive p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-200",
                              selectedUpiApp === app ? "ring-2 ring-primary" : ""
                            )}
                          >
                            <UpiApps app={app} className="w-8 h-8"/>
                            <span className="text-xs font-medium capitalize">{app}</span>
                            {selectedUpiApp === app && <Check className="w-4 h-4 text-primary absolute top-1 right-1"/>}
                          </button>
                       ))}
                    </div>
                </div>

                {selectedUpiApp && (
                  <div className="text-center bg-muted/50 p-4 rounded-lg border space-y-4">
                      <p className='font-semibold'>Scan to Pay with {selectedUpiApp}</p>
                      <div className="flex justify-center">
                        <Image src={qrCodeUrl} alt="Payment QR Code" width={150} height={150} className='rounded-md' />
                      </div>
                      <div className="relative">
                          <Input value={UPI_ID} readOnly className="pr-10 text-center" />
                          <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8" onClick={copyToClipboard}>
                              <Copy className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
                )}
                
                <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID / UPI Reference No.</Label>
                    <Input id="transactionId" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter the 12-digit ID" disabled={isSubmitting}/>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="payment-proof">Payment Proof (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="payment-proof" type="file" onChange={handleFileChange} className="flex-1" disabled={isSubmitting}/>
                       <Button variant="outline" size="icon" asChild>
                        <label htmlFor="payment-proof" className={cn("cursor-pointer", isSubmitting && "cursor-not-allowed opacity-50")}>
                          <Upload className="w-4 h-4"/>
                        </label>
                      </Button>
                    </div>
                    {paymentProof && <p className="text-xs text-muted-foreground">File: {paymentProof.name}</p>}
                </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>Back</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !transactionId}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Submit Registration'}
              </Button>
            </DialogFooter>
           </>
        )}
      </DialogContent>
    </Dialog>
  );
}
