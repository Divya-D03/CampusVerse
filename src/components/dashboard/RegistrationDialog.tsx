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
import { Loader2 } from 'lucide-react';

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
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!srn || !course || !semester || !school) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Form',
        description: 'Please fill out all the fields to register.',
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for {event?.title}</DialogTitle>
          <DialogDescription>
            Please fill in your details to complete the registration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register Now'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
