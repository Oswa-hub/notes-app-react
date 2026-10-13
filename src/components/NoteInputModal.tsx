
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { Note, NoteDraft } from '../types';

type Props = {
  visible: boolean;
  initial?: NoteDraft;
  onSave: (draft: NoteDraft) => void;
  onCancel: () => void;
};

export function NoteInputModal({
  visible,
  initial,
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle(initial?.title ?? '');
      setContent(initial?.content ?? '');
    }
  }, [visible, initial]);

  const saveNote = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.heading}>
            {initial ? 'Edit note' : 'New note'}
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
            <Pressable onPress={onCancel}>
              <Text style={styles.action}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={saveNote}
              disabled={!title.trim()}
            >
              <Text
                style={[
                  styles.action,
                  !title.trim() && { opacity: 0.4 },
                ]}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 24,
  },
  dialog: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f0f0f3',
    padding: 12,
    borderRadius: 8,
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
  action: {
    color: '#208AEF',
    fontSize: 16,
  },
});
