
import { ID, type Models } from 'react-native-appwrite';

import { account } from '../lib/appwrite';

export type User = Models.User<Models.DefaultPreferences>;

/** Returns the logged-in user, or null when there is no valid session. */
export async function getCurrentUser(): Promise<User | null> {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  await account.createEmailPasswordSession({ email, password });
  return account.get();
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
  await account.create({ userId: ID.unique(), email, password, name });
  // Creating an account does not open a session: sign in right after
  return signIn(email, password);
}

export async function signOut(): Promise<void> {
  await account.deleteSession({ sessionId: 'current' });
}
