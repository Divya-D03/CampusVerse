'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, UserCog, Coins, PlusCircle, Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { QrCodeDialog } from '../dashboard/qr-code-dialog';
import Link from 'next/link';
import { AppLogo } from './app-logo';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useClubMemberVerification } from '../dashboard/club-member-proof';
import { HostEventDialog } from '../dashboard/host-event-dialog';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

export function AppHeader() {
  const { user, toggleRole } = useAuth();
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const [showHostEventDialog, setShowHostEventDialog] = useState(false);
  const { isVerified } = useClubMemberVerification();
  
  if (!user) return null;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
  
  const avatarSrc = user.profilePicture || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`;


  return (
    <>
      <HostEventDialog open={showHostEventDialog} onOpenChange={setShowHostEventDialog} />
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container flex h-20 items-center">
          <div className="mr-auto flex items-center">
            <button onClick={() => setIsAppInfoOpen(true)} className="mr-2 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
                <AppLogo />
            </button>
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block font-headline text-lg">
                CampusVerse
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-2 bg-card/50 p-1 rounded-full">
              <Label htmlFor="role-switch" className="text-sm text-muted-foreground hidden sm:block pl-2">
                {user.role === 'Regular User' ? 'User' : 'Club Member'}
              </Label>
              <Switch
                id="role-switch"
                checked={user.role === 'Club Member'}
                onCheckedChange={toggleRole}
                aria-label="Toggle user role"
              />
               {user.role === 'Club Member' && isVerified && (
                  <Button onClick={() => setShowHostEventDialog(true)} size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Host Event
                  </Button>
                )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-3 py-1.5 rounded-full h-auto">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Coins className="w-5 h-5 text-yellow-400"/>
                    <span className="font-bold text-lg">{user.coins}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel>Your Coins</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 text-sm text-muted-foreground">
                  <p>Redeem your coins at the college food court.</p>
                  <p className="font-bold text-foreground mt-1">5 Coins = 1 Rupee</p>
                </div>
                <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setIsQrCodeDialogOpen(true)}>
                    <Button className="w-full">
                        <Coins className="mr-2 h-4 w-4" />
                        Redeem Now
                    </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarSrc} alt={user.email || ''} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {user && <QrCodeDialog user={user} open={isQrCodeDialogOpen} onOpenChange={setIsQrCodeDialogOpen} />}
      <AlertDialog open={isAppInfoOpen} onOpenChange={setIsAppInfoOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-headline">
              <AppLogo />
              About CampusVerse
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-base pt-4 space-y-2">
                <p>
                  Welcome to CampusVerse, your all-in-one university event hub! 
                </p>
                 <p>
                  Discover and register for cultural fests, tech hackathons, and club activities. Win events to earn coins and redeem them for exciting rewards at campus food courts.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAppInfoOpen(false)}>
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
