'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, UserRole, CoinTransaction, Event } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { culturalEvents, hackathons, techEvents, clubs, ideathons, projectExpos } from '@/lib/placeholder-data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirstLogin: boolean;
  events: Event[];
  allUsers: User[];
  login: (email: string) => void;
  logout: () => void;
  toggleRole: () => void;
  updateUser: (data: Partial<Pick<User, 'name' | 'mobileNumber' | 'gender'>>) => void;
  updateUserProfilePicture: (dataUrl: string) => void;
  updateUserSettings: (settings: Pick<User, 'mobileNumber' | 'githubUrl' | 'linkedinUrl'>) => void;
  markFirstLoginDone: () => void;
  addCoinTransaction: (transaction: Omit<CoinTransaction, 'id' | 'date'>) => void;
  deductCoinsForRegistration: (amount: number, eventName: string) => void;
  addEvent: (event: Event) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to generate unique IDs for transactions
const generateUniqueTxId = () => crypto.randomUUID();

const initialEvents: Event[] = [
  ...culturalEvents,
  ...hackathons,
  ...techEvents,
  ...clubs,
  ...ideathons,
  ...projectExpos
];

// Mock data for other users for the leaderboard
const mockUsers: User[] = [
  { email: 'jane.doe@reva.edu.in', name: 'Jane Doe', role: 'Regular User', coins: 1250, eventsWon: 12 },
  { email: 'john.smith@reva.edu.in', name: 'John Smith', role: 'Club Member', coins: 800, eventsWon: 7 },
  { email: 'alex.jones@reva.edu.in', name: 'Alex Jones', role: 'Regular User', coins: 1500, eventsWon: 21 },
  { email: 'emily.white@reva.edu.in', name: 'Emily White', role: 'Regular User', coins: 450, eventsWon: 3 },
  { email: 'michael.brown@reva.edu.in', name: 'Michael Brown', role: 'Club Member', coins: 200, eventsWon: 1 },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('campusverse_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAllUsers(currentUsers => {
            const otherUsers = currentUsers.filter(u => u.email !== parsedUser.email);
            return [...otherUsers, parsedUser];
        });
        
        const firstLoginFlag = localStorage.getItem('campusverse_first_login_done');
        if (!firstLoginFlag || !parsedUser.name) {
            setIsFirstLogin(true);
        }
      }
      const storedEvents = localStorage.getItem('campusverse_events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents(initialEvents);
      }
    } catch (error) {
      console.error('Failed to parse data from localStorage', error);
      localStorage.removeItem('campusverse_user');
      localStorage.removeItem('campusverse_events');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string) => {
    const welcomeTransaction: CoinTransaction = {
      id: generateUniqueTxId(),
      reason: 'Welcome Bonus!',
      amount: 50,
      type: 'earned',
      date: new Date().toISOString(),
    };
    const newUser: User = {
      email,
      role: 'Regular User',
      coins: 50,
      coinHistory: [welcomeTransaction],
      eventsWon: 0,
    };
    localStorage.setItem('campusverse_user', JSON.stringify(newUser));
    localStorage.removeItem('campusverse_first_login_done');
    localStorage.removeItem('club_member_verified');
    localStorage.setItem('campusverse_events', JSON.stringify(initialEvents));
    setUser(newUser);
    setAllUsers([...mockUsers, newUser]);
    setEvents(initialEvents);
    setIsFirstLogin(true);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('campusverse_user');
    localStorage.removeItem('campusverse_first_login_done');
    localStorage.removeItem('club_member_verified');
    localStorage.removeItem('campusverse_events');
    setUser(null);
    setAllUsers(mockUsers);
    setIsFirstLogin(false);
    router.push('/login');
  }, [router]);

  const updateUserAndUsersList = (updatedUser: User) => {
    setUser(updatedUser);
    setAllUsers(currentUsers => {
        const otherUsers = currentUsers.filter(u => u.email !== updatedUser.email);
        return [...otherUsers, updatedUser];
    });
    localStorage.setItem('campusverse_user', JSON.stringify(updatedUser));
  }

  const toggleRole = () => {
    if (!user) return;
    const newRole: UserRole = user.role === 'Regular User' ? 'Club Member' : 'Regular User';
    const updatedUser = { ...user, role: newRole };
    updateUserAndUsersList(updatedUser);
  };

  const updateUser = (data: Partial<Pick<User, 'name' | 'mobileNumber' | 'gender'>>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    updateUserAndUsersList(updatedUser);
  };

  const updateUserProfilePicture = (dataUrl: string) => {
    if (!user) return;
    const updatedUser = { ...user, profilePicture: dataUrl };
    updateUserAndUsersList(updatedUser);
  };

  const updateUserSettings = (settings: Pick<User, 'mobileNumber' | 'githubUrl' | 'linkedinUrl'>) => {
    if (!user) return;
    const updatedUser = { ...user, ...settings };
    updateUserAndUsersList(updatedUser);
  };

  const markFirstLoginDone = () => {
    setIsFirstLogin(false);
    localStorage.setItem('campusverse_first_login_done', 'true');
  };

  const addCoinTransaction = (transaction: Omit<CoinTransaction, 'id' | 'date'>) => {
    if (!user) return;
    
    const newTransaction: CoinTransaction = {
      ...transaction,
      id: generateUniqueTxId(),
      date: new Date().toISOString(),
    };
    
    const updatedHistory = [...(user.coinHistory || []), newTransaction];
    const updatedCoins = user.coins + (newTransaction.type === 'earned' ? newTransaction.amount : -newTransaction.amount);

    const updatedUser: User = {
      ...user,
      coins: updatedCoins,
      coinHistory: updatedHistory
    };
    updateUserAndUsersList(updatedUser);
  };

  const deductCoinsForRegistration = (amount: number, eventName: string) => {
    addCoinTransaction({
      reason: `Fee for ${eventName}`,
      amount: amount,
      type: 'spent',
    });
  };

  const addEvent = (event: Event) => {
    setEvents(currentEvents => {
      const updatedEvents = [...currentEvents, event];
      localStorage.setItem('campusverse_events', JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, allUsers, isFirstLogin, events, login, logout, toggleRole, updateUser, updateUserProfilePicture, updateUserSettings, markFirstLoginDone, addCoinTransaction, deductCoinsForRegistration, addEvent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
