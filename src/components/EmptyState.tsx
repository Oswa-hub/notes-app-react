import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  onCreate: () => void;
};

export function EmptyState({ onCreate }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📝</Text>

      <Text style={styles.title}>
        No notes yet
      </Text>

      <Text style={styles.text}>
        Write your first note. It is private: only you can see it.
      </Text>

      <Pressable
        style={styles.button}
        onPress={onCreate}
      >
        <Text style={styles.buttonText}>
          Create a note
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },

  emoji: {
    fontSize: 48,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  text: {
    color: '#60646c',
    textAlign: 'center',
  },

  button: {
    marginTop: 12,
    backgroundColor: '#208AEF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});