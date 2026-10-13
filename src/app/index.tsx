
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes App</Text>
      <Text style={styles.subtitle}>Hello, {user?.name || user?.email}</Text>

      <Link href="/notes" style={styles.link}>
        Open my notes →
      </Link>

      <Pressable onPress={signOut}>
        <Text style={styles.signOut}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#60646c' },
  link: { marginTop: 16, padding: 12, fontSize: 18, color: '#208AEF' },
  signOut: { color: '#c0392b', fontSize: 16, padding: 8 },
});
