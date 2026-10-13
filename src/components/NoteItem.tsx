
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Note } from '../types';

type Props = {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: () => void;
};

export function NoteItem({ note, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Pressable style={styles.body} onPress={() => onEdit(note)}>
        <Text style={styles.title}>{note.title}</Text>
        <Text numberOfLines={2}>{note.content}</Text>
      </Pressable>

      <Pressable
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${note.title}`}
        hitSlop={10}>
        <Text style={styles.delete}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  delete: {
    fontSize: 18,
  },
});
