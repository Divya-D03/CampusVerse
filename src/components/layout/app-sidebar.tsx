'use client';

import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { AppLogo } from './app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  LayoutDashboard,
  Paintbrush,
  Code,
  Users,
  User as UserIcon,
  Settings,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeCategory = searchParams.get('category') || 'cultural';
  
  if (!user) return null;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
  const avatarSrc = user.profilePicture || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.email}`;

  const handleNavigation = (category: string) => {
    router.push(`/?category=${category}`);
  };

  const isMainPage = pathname === '/';

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <AppLogo className="w-7 h-7 text-sidebar-foreground" />
          <span className="text-lg font-semibold text-sidebar-foreground">
            CampusVerse
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isMainPage}
            >
              <Link href="/">
                <LayoutDashboard />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleNavigation('cultural')}
              isActive={isMainPage && activeCategory === 'cultural'}
            >
              <Paintbrush />
              Cultural
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleNavigation('tech')}
              isActive={isMainPage && activeCategory === 'tech'}
            >
              <Code />
              Tech
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleNavigation('clubs')}
              isActive={isMainPage && activeCategory === 'clubs'}
            >
              <Users />
              Clubs
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/profile'}>
              <Link href="/profile">
                <UserIcon />
                Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/settings'}>
              <Link href="/settings">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon /> : <Sun />}
              <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <div className="p-2 flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarSrc} alt={user.email || ''} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none text-sidebar-foreground">
              {user.name || user.email.split('@')[0]}
            </p>
            <p className="text-xs leading-none text-sidebar-foreground/70">
              {user.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
