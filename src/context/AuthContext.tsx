
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import * as auth from '../services/auth';

type AuthState = {
  user: auth.User | null;
  initializing: boolean; // true until we know whether a session exists
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<auth.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Restore the session once, when the app starts
  useEffect(() => {
    auth
      .getCurrentUser()
      .then(setUser)
      .finally(() => setInitializing(false));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      initializing,
      signIn: async (email, password) => setUser(await auth.signIn(email, password)),
      signUp: async (name, email, password) => setUser(await auth.signUp(name, email, password)),
      signOut: async () => {
        await auth.signOut();
        setUser(null);
      },
    }),
    [user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
