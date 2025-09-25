'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User } from '@/lib/types';
import Image from 'next/image';

interface QrCodeDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrCodeDialog({ user, open, onOpenChange }: QrCodeDialogProps) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    JSON.stringify({ userId: user.email, coupons: user.coupons })
  )}`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center font-headline text-2xl">
            Redeem Your Coupons
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='text-center text-base pt-4'>
              <p>Show this QR code at any college food court to redeem your coupons.</p>
              <div className="flex justify-center my-6">
                <Image src={qrCodeUrl} alt="Coupon QR Code" width={200} height={200} />
              </div>
              <p className="font-bold text-lg">You have {user.coupons} coupons</p>
              <p className="text-muted-foreground">(2 Coupons = 1 Rupee)</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
