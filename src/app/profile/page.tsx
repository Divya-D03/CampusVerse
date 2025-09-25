'use client';

import { useAuth } from '@/contexts/auth-context';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { AppHeader } from '@/components/layout/app-header';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, BarChart3, CalendarCheck2 } from 'lucide-react';
import { culturalEvents, hackathons, techEvents } from '@/lib/placeholder-data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <LoadingScreen />;
  }
  
  const allEvents = [...culturalEvents, ...hackathons, ...techEvents];
  // Dummy data for demonstration
  const participatedEvents = allEvents.slice(0, 2);
  const wonEvents = allEvents.slice(2, 3);
  
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative h-24 w-24 rounded-full border-4 border-primary">
               <Image src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.email}`} alt={user.email} layout="fill" className="rounded-full" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-headline">{user.name || user.email.split('@')[0]}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="holographic-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Coupons</CardTitle>
                <Award className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.coupons}</div>
                <p className="text-xs text-muted-foreground">2 coupons = 1 Rupee</p>
              </CardContent>
            </Card>
            <Card className="holographic-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Events Participated</CardTitle>
                <CalendarCheck2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{participatedEvents.length}</div>
              </CardContent>
            </Card>
            <Card className="holographic-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Events Won</CardTitle>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wonEvents.length}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-headline font-bold mb-4">Event History</h2>
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-primary">Events Won</h3>
              {wonEvents.map(event => (
                <Card key={event.id} className="holographic-card">
                   <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Congratulations! You won <span className="font-bold text-accent">{event.coupons} coupons</span>.</p>
                  </CardContent>
                </Card>
              ))}
               <h3 className="font-bold text-lg text-primary mt-6">Events Participated</h3>
               {participatedEvents.map(event => (
                <Card key={event.id} className="holographic-card">
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.date}</CardDescription>
                  </CardHeader>
                   <CardContent>
                    <p>{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
