
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../lib/errors';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      if (registering) await signUp(name.trim(), email.trim(), password);
      else await signIn(email.trim(), password);
      // On success the user becomes non-null and the router leaves this screen by itself
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>{registering ? 'Create account' : 'Sign in'}</Text>

      {registering && (
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min. 8 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={[styles.button, busy && styles.disabled]} onPress={submit} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{registering ? 'Create account' : 'Sign in'}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => setRegistering(!registering)}>
        <Text style={styles.link}>
          {registering ? 'I already have an account' : "I don't have an account"}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#f0f0f3', borderRadius: 8, padding: 12, fontSize: 16 },
  error: { color: '#c0392b' },
  button: { backgroundColor: '#208AEF', borderRadius: 8, padding: 14, alignItems: 'center' },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#208AEF', textAlign: 'center', padding: 8 },
});
