
import { useCallback, useEffect, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { Note, NoteDraft } from '../types';

import {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../services/notes';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const showError = (message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Error', message);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await listNotes();
      setNotes(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Could not load notes'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openNew = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setModalVisible(true);
  };

  const openEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  };

  const save = async () => {
    if (!title.trim()) {
      showError('Please enter a title.');
      return;
    }

    const draft: NoteDraft = {
      title: title.trim(),
      content: content.trim(),
    };

    try {
      if (editingId) {
        const updated = await updateNote(editingId, draft);

        setNotes(current =>
          current.map(note =>
            note.id === editingId ? updated : note
          )
        );
      } else {
        const created = await createNote(draft);
        setNotes(current => [created, ...current]);
      }

      setModalVisible(false);
    } catch (e) {
      showError(
        e instanceof Error ? e.message : 'Could not save note'
      );
    }
  };

  const remove = async (note: Note) => {
    const confirmDelete = async () => {
      try {
        await deleteNote(note.id);

        setNotes(current =>
          current.filter(n => n.id !== note.id)
        );
      } catch (e) {
        showError(
          e instanceof Error ? e.message : 'Could not delete note'
        );
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${note.title}"?`)) {
        await confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete note',
        `Delete "${note.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => void confirmDelete(),
          },
        ]
      );
    }
  };

  if (loading && notes.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading notes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable onPress={() => void load()}>
          <Text style={styles.retry}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={note => note.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => void load()}
        ListEmptyComponent={
  <EmptyState onCreate={openNew} />
}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={styles.cardBody}
              onPress={() => openEdit(item)}
            >
              <Text style={styles.cardTitle}>
                {item.title}
              </Text>
              <Text numberOfLines={2}>
                {item.content}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => void remove(item)}
              hitSlop={8}
            >
              <Text>🗑️</Text>
            </Pressable>
          </View>
        )}
      />

      <Pressable style={styles.fab} onPress={openNew}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>
              {editingId ? 'Edit note' : 'New note'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              multiline
            />

            <View style={styles.actions}>
              <Pressable
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.action}>Cancel</Text>
              </Pressable>

              <Pressable onPress={() => void save()}>
                <Text style={styles.action}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  list: { padding: 16, gap: 12 },
  error: { color: '#c0392b', textAlign: 'center' },
  retry: { color: '#208AEF', fontSize: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    backgroundColor: '#f0f0f3',
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  dialogTitle: { fontSize: 20, fontWeight: 'bold' },
  input: {
    backgroundColor: '#f0f0f3',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
  },
  action: { color: '#208AEF', fontSize: 16 },
});
