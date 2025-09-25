'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

export function ClubMemberProof() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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
    toast({
      title: 'Proof Submitted',
      description: 'Your proof has been submitted for verification.',
    });
  };

  if (isSubmitted) {
    return (
      <Card className="mb-8 bg-green-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-400" />
            Verification in Progress
          </CardTitle>
          <CardDescription>
            Your proof of club membership has been submitted. You will be notified once the verification is complete.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
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
  );
}
