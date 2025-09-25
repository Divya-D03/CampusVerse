'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirstLogin: boolean;
  login: (email: string) => void;
  logout: () => void;
  toggleRole: () => void;
  updateUserName: (name: string) => void;
  markFirstLoginDone: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const newUser: User = {
      email,
      role: 'Regular User',
      coupons: 50,
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

  const markFirstLoginDone = () => {
    setIsFirstLogin(false);
    localStorage.setItem('campusverse_first_login_done', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFirstLogin, login, logout, toggleRole, updateUserName, markFirstLoginDone }}>
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
