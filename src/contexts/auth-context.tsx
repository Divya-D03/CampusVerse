'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, UserRole, CouponTransaction } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirstLogin: boolean;
  login: (email: string) => void;
  logout: () => void;
  toggleRole: () => void;
  updateUserName: (name: string) => void;
  updateUserProfilePicture: (dataUrl: string) => void;
  markFirstLoginDone: () => void;
  addCouponTransaction: (transaction: Omit<CouponTransaction, 'id' | 'date'>) => void;
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
    const welcomeTransaction: CouponTransaction = {
      id: generateUniqueTxId(),
      reason: 'Welcome Bonus!',
      amount: 50,
      type: 'earned',
      date: new Date().toISOString(),
    };
    const newUser: User = {
      email,
      role: 'Regular User',
      coupons: 50,
      couponHistory: [welcomeTransaction],
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

  const updateUserName = (name: string) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedUser = { ...currentUser, name };
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

  const markFirstLoginDone = () => {
    setIsFirstLogin(false);
    localStorage.setItem('campusverse_first_login_done', 'true');
  };

  const addCouponTransaction = (transaction: Omit<CouponTransaction, 'id' | 'date'>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      
      const newTransaction: CouponTransaction = {
        ...transaction,
        id: generateUniqueTxId(),
        date: new Date().toISOString(),
      };
      
      const updatedHistory = [...(currentUser.couponHistory || []), newTransaction];
      const updatedCoupons = currentUser.coupons + (newTransaction.type === 'earned' ? newTransaction.amount : -newTransaction.amount);

      const updatedUser: User = {
        ...currentUser,
        coupons: updatedCoupons,
        couponHistory: updatedHistory
      };

      localStorage.setItem('campusverse_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFirstLogin, login, logout, toggleRole, updateUserName, updateUserProfilePicture, markFirstLoginDone, addCouponTransaction }}>
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
