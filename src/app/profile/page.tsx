'use client';

import { useAuth } from '@/contexts/auth-context';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { AppHeader } from '@/components/layout/app-header';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Coins, BarChart3, CalendarCheck2, Home, Camera, FileText, LogOut, PlusCircle, CheckCircle } from 'lucide-react';
import { culturalEvents, hackathons, techEvents } from '@/lib/placeholder-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CouponHistory } from '@/components/profile/coupon-history';
import { HostEventDialog } from '@/components/dashboard/host-event-dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, loading, updateUserProfilePicture, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHostEventDialog, setShowHostEventDialog] = useState(false);
  const [isClubMemberVerified, setIsClubMemberVerified] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    // This is a simple check based on the pattern in ClubMemberProof component.
    // In a real app, this verification status would likely come from the backend/auth context.
    if (user?.role === 'Club Member') {
      const storedStatus = localStorage.getItem('club_member_verified');
      if (storedStatus === 'true') {
        setIsClubMemberVerified(true);
      }
    } else {
        setIsClubMemberVerified(false);
    }
  }, [user?.role]);


  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    let score = 0;
    if (user.name) score++;
    if (user.profilePicture) score++;
    if (user.mobileNumber) score++;
    if (user.githubUrl) score++;
    if (user.linkedinUrl) score++;
    return (score / 5) * 100;
  }, [user]);


  if (loading || !user) {
    return <LoadingScreen />;
  }

  const allEvents = [...culturalEvents, ...hackathons, ...techEvents];
  // Dummy data for demonstration
  const participatedEvents = allEvents.slice(0, 2);
  const wonEvents = allEvents.slice(2, 3);
  const userSkills = user.skills || ['React', 'Node.js', 'Cybersecurity', 'Public Speaking'];

  const participationCount = participatedEvents.length;
  let rank: 'Newbie' | 'Pro' | 'Master' | 'Grandmaster' = 'Newbie';
  let rankStyles = 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  if (participationCount >= 10) {
    rank = 'Grandmaster';
    rankStyles = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  } else if (participationCount >= 6) {
    rank = 'Master';
    rankStyles = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  } else if (participationCount >= 3) {
    rank = 'Pro';
    rankStyles = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }

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
    <>
      <HostEventDialog open={showHostEventDialog} onOpenChange={setShowHostEventDialog} />
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
                   {user.role === 'Club Member' && (
                    <p className="text-sm font-semibold mt-1 flex items-center gap-1">
                      {isClubMemberVerified ? <CheckCircle className="text-green-400 w-4 h-4" /> : null}
                      {isClubMemberVerified ? 'Verified Club Member' : 'Unverified Club Member'}
                    </p>
                   )}
                   <Badge variant="outline" className={cn("mt-2 text-base", rankStyles)}>
                        {rank}
                    </Badge>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                {user.role === 'Club Member' && isClubMemberVerified && (
                  <Button onClick={() => setShowHostEventDialog(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Host Event
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                 <Button variant="destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card className="holographic-card md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={profileCompletion} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{Math.round(profileCompletion)}% complete. <Link href="/settings" className="text-primary hover:underline">Add more details</Link>.</p>
                </CardContent>
              </Card>
              <Card className="holographic-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Coins</CardTitle>
                  <Coins className="w-4 h-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.coins}</div>
                  <p className="text-xs text-muted-foreground">5 coins = 1 Rupee</p>
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

            <div className="mb-8">
                <h2 className="text-2xl font-headline font-bold mb-4">My Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map((skill, index) => (
                     <Badge key={index} variant="secondary" className="text-base py-1 px-3">{skill}</Badge>
                  ))}
                </div>
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
                        <p>Congratulations! You won <span className="font-bold text-yellow-400">{event.coins} coins</span>.</p>
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
                <h2 className="text-2xl font-headline font-bold mb-4">Coin History</h2>
                <CouponHistory transactions={user.coinHistory || []} />
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
    </>
  );
}
