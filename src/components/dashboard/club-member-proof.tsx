'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

const ClubMemberVerificationContext = createContext({ isVerified: false });

export const useClubMemberVerification = () => useContext(ClubMemberVerificationContext);

export function ClubMemberProof() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedStatus = localStorage.getItem('club_member_verified');
    if (storedStatus === 'true') {
      setIsSubmitted(true);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload.',
      });
      return;
    }

    setIsUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsUploading(false);
    setIsSubmitted(true);
    localStorage.setItem('club_member_verified', 'true');
    toast({
      title: 'Proof Submitted',
      description: 'Your proof has been submitted for verification.',
    });
  };

  if (isSubmitted) {
    return (
      <ClubMemberVerificationContext.Provider value={{ isVerified: true }}>
        <Card className="mb-8 bg-green-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-400" />
              Club Membership Verified
            </CardTitle>
            <CardDescription>
              You can now access exclusive club features, like hosting events.
            </CardDescription>
          </CardHeader>
        </Card>
      </ClubMemberVerificationContext.Provider>
    );
  }

  return (
     <ClubMemberVerificationContext.Provider value={{ isVerified: false }}>
        <Card className="mb-8 holographic-card">
        <CardHeader>
            <CardTitle>Verify Club Membership</CardTitle>
            <CardDescription>
            To access exclusive club features, please upload a proof of your membership (e.g., ID card, confirmation email).
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="proof-upload">Proof Document</Label>
            <Input id="proof-upload" type="file" onChange={handleFileChange} className="file:text-primary file:font-bold" />
            </div>
            <Button onClick={handleSubmit} disabled={isUploading || !file}>
            <UploadCloud className="mr-2 h-4 w-4" />
            {isUploading ? 'Submitting...' : 'Submit for Verification'}
            </Button>
        </CardContent>
        </Card>
    </ClubMemberVerificationContext.Provider>
  );
}
