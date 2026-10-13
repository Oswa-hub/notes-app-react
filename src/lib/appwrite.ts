
import 'react-native-url-polyfill/auto';
import { Account, Client, TablesDB } from 'react-native-appwrite';

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Check your .env file and restart Expo.`
    );
  }
  return value;
}

export const config = {
  endpoint: required(
    process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    'EXPO_PUBLIC_APPWRITE_ENDPOINT'
  ),
  projectId: required(
    process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    'EXPO_PUBLIC_APPWRITE_PROJECT_ID'
  ),
  platform: required(
    process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    'EXPO_PUBLIC_APPWRITE_PLATFORM'
  ),
  databaseId: required(
    process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    'EXPO_PUBLIC_APPWRITE_DATABASE_ID'
  ),
  tableId: required(
    process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID,
    'EXPO_PUBLIC_APPWRITE_TABLE_ID'
  ),
};

export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const tablesDB = new TablesDB(client);
export const account = new Account(client);
