'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, UserRole, CoinTransaction } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirstLogin: boolean;
  login: (email: string) => void;
  logout: () => void;
  toggleRole: () => void;
  updateUser: (data: Partial<Pick<User, 'name' | 'mobileNumber' | 'gender'>>) => void;
  updateUserProfilePicture: (dataUrl: string) => void;
  updateUserSettings: (settings: Pick<User, 'mobileNumber' | 'githubUrl' | 'linkedinUrl'>) => void;
  markFirstLoginDone: () => void;
  addCoinTransaction: (transaction: Omit<CoinTransaction, 'id' | 'date'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to generate unique IDs for transactions
const generateUniqueTxId = () => crypto.randomUUID();


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('campusverse_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const firstLoginFlag = localStorage.getItem('campusverse_first_login_done');
        if (!firstLoginFlag || !parsedUser.name) {
            setIsFirstLogin(true);
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('campusverse_user');
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
    };
    localStorage.setItem('campusverse_user', JSON.stringify(newUser));
    localStorage.removeItem('campusverse_first_login_done');
    setUser(newUser);
    setIsFirstLogin(true);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('campusverse_user');
    localStorage.removeItem('campusverse_first_login_done');
    setUser(null);
    setIsFirstLogin(false);
    router.push('/login');
  }, [router]);

  const toggleRole = () => {
    setUser((currentUser) => {
      if (!currentUser) return null;
      const newRole: UserRole = currentUser.role === 'Regular User' ? 'Club Member' : 'Regular User';
      const updatedUser = { ...currentUser, role: newRole };
      localStorage.setItem('campusverse_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateUser = (data: Partial<Pick<User, 'name' | 'mobileNumber' | 'gender'>>) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem('campusverse_user', JSON.stringify(updatedUser));
        return updatedUser;
    });
  };

  const updateUserProfilePicture = (dataUrl: string) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, profilePicture: dataUrl };
      localStorage.setItem('campusverse_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateUserSettings = (settings: Pick<User, 'mobileNumber' | 'githubUrl' | 'linkedinUrl'>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, ...settings };
      localStorage.setItem('campusverse_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const markFirstLoginDone = () => {
    setIsFirstLogin(false);
    localStorage.setItem('campusverse_first_login_done', 'true');
  };

  const addCoinTransaction = (transaction: Omit<CoinTransaction, 'id' | 'date'>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      
      const newTransaction: CoinTransaction = {
        ...transaction,
        id: generateUniqueTxId(),
        date: new Date().toISOString(),
      };
      
      const updatedHistory = [...(currentUser.coinHistory || []), newTransaction];
      const updatedCoins = currentUser.coins + (newTransaction.type === 'earned' ? newTransaction.amount : -newTransaction.amount);

      const updatedUser: User = {
        ...currentUser,
        coins: updatedCoins,
        coinHistory: updatedHistory
      };

      localStorage.setItem('campusverse_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFirstLogin, login, logout, toggleRole, updateUser, updateUserProfilePicture, updateUserSettings, markFirstLoginDone, addCoinTransaction }}>
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
