
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '../context/AuthContext';

// Keep the splash screen visible until we know if there is a session
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (!initializing) SplashScreen.hide();
  }, [initializing]);

  if (initializing) return null;

  return (
    <Stack>
      <Stack.Protected guard={user !== null}>
        <Stack.Screen name="index" options={{ title: 'Notes App' }} />
        <Stack.Screen name="notes" options={{ title: 'My Notes' }} />
      </Stack.Protected>

      <Stack.Protected guard={user === null}>
        <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
