'use client';

import { useAuth } from '@/contexts/auth-context';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { AppHeader } from '@/components/layout/app-header';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, BarChart3, CalendarCheck2, Home, Camera, FileText } from 'lucide-react';
import { culturalEvents, hackathons, techEvents } from '@/lib/placeholder-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CouponHistory } from '@/components/profile/coupon-history';

export default function ProfilePage() {
  const { user, loading, updateUserProfilePicture } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        updateUserProfilePicture(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const avatarSrc = user.profilePicture || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={handleAvatarClick}
                  className="relative h-24 w-24 rounded-full border-4 border-primary overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <Image src={avatarSrc} alt={user.email || 'user avatar'} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                </button>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline">{user.name || user.email.split('@')[0]}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
            <div>
              <h2 className="text-2xl font-headline font-bold mb-4">Coupon History</h2>
              <CouponHistory transactions={user.couponHistory || []} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-headline font-bold mb-4">Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-primary mb-4">Winning Certificates</h3>
                   <div className="space-y-4">
                    {wonEvents.map(event => (
                      <Card key={`cert-won-${event.id}`} className="holographic-card">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className='flex items-center gap-4'>
                                <FileText className="w-6 h-6 text-accent"/>
                                <div>
                                    <p className="font-bold">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">Winning Certificate</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Download</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                 <div>
                  <h3 className="font-bold text-lg text-primary mb-4">Participation Certificates</h3>
                  <div className="space-y-4">
                    {participatedEvents.map(event => (
                      <Card key={`cert-part-${event.id}`} className="holographic-card">
                         <CardContent className="p-4 flex items-center justify-between">
                            <div className='flex items-center gap-4'>
                                <FileText className="w-6 h-6 text-accent"/>
                                <div>
                                    <p className="font-bold">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">Participation Certificate</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Download</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
