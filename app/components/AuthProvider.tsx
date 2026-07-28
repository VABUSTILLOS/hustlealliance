'use client';

// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
// Bypass: immediately seed Zustand store + localStorage with a mock admin user.
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { MOCK_USER_INFO } from '@/lib/auth/mock';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Seed mock user into Zustand + localStorage so all client components see it
    localStorage.setItem('hustle_user_info', JSON.stringify(MOCK_USER_INFO));
    useStore.setState({
      isAuthenticated: true,
      currentUser: MOCK_USER_INFO,
    });
    setReady(true);
  }, []);

  return <>{children}</>;
}
