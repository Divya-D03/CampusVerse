
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/lib/types';
import { CalendarPlus } from 'lucide-react';

interface EventRegistrationDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  srn: z.string().min(1, { message: 'SRN is required.' }),
  course: z.string().min(1, { message: 'Please select a course.' }),
  school: z.string().min(1, { message: 'Please select a school.' }),
});

const courses = ['CSE', 'AIDS', 'ECE', 'EEE', 'ME'];
const schools = ['School of CSE', 'School of C&IT', 'School of ECE', 'School of EEE', 'School of Mechanical Engineering'];

export function EventRegistrationDialog({ event, open, onOpenChange }: EventRegistrationDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      srn: '',
      course: '',
      school: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Registration details:', values);
    toast({
      title: 'Registration Successful!',
      description: `You have successfully registered for ${event.title}.`,
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <CalendarPlus className="w-6 h-6 text-primary" />
            Register for {event.title}
          </DialogTitle>
          <DialogDescription>
            Please fill in your details to register for this event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="srn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SRN (Student Registration Number)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your SRN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School of Engineering</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {schools.map((school) => (
                        <SelectItem key={school} value={school}>{school}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Register</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
