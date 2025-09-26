
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
import { User, UserCog, Gift, Ticket } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { QrCodeDialog } from '../dashboard/qr-code-dialog';
import Link from 'next/link';
import { AppLogo } from './app-logo';

export function AppHeader() {
  const { user, toggleRole } = useAuth();
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);
  
  if (!user) return null;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
  
  const avatarSrc = user.profilePicture || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`;


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/30 backdrop-blur-xl">
        <div className="container flex h-16 items-center">
          <div className="mr-auto flex items-center">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <AppLogo />
              <span className="hidden font-bold sm:inline-block font-headline">
                CampusVerse
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="role-switch" className="text-sm text-muted-foreground hidden sm:block">
                {user.role === 'Regular User' ? 'User' : 'Club Member'}
              </Label>
              <Switch
                id="role-switch"
                checked={user.role === 'Club Member'}
                onCheckedChange={toggleRole}
                aria-label="Toggle user role"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Ticket className="w-5 h-5 text-primary"/>
                  <span className="font-bold text-lg">{user.coins}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 holographic-card" align="end" forceMount>
                <DropdownMenuLabel>Your Coins</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 text-sm text-muted-foreground">
                  <p>Redeem your coins at the college food court.</p>
                  <p className="font-bold text-foreground mt-1">2 Coins = 1 Rupee</p>
                </div>
                <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setIsQrCodeDialogOpen(true)}>
                    <Button className="w-full">
                        <Gift className="mr-2 h-4 w-4" />
                        Redeem Now
                    </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarSrc} alt={user.email} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 holographic-card" align="end" forceMount>
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
    </>
  );
}