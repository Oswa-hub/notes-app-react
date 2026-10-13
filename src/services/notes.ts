import {
  ID,
  Query,
  Permission,
  Role,
  type Models,
} from 'react-native-appwrite';

import { account, config, tablesDB } from '../lib/appwrite';
import type { Note, NoteDraft } from '../types';

type NoteRow = Models.Row & {
  title: string;
  content?: string;
  userId: string;
};

const target = {
  databaseId: config.databaseId,
  tableId: config.tableId,
};

const toNote = (row: NoteRow): Note => ({
  id: row.$id,
  title: row.title,
  content: row.content ?? '',
});

async function getCurrentUserId() {
  const user = await account.get();
  return user.$id;
}


export async function listNotes(): Promise<Note[]> {
  const userId = await getCurrentUserId();

  const result = await tablesDB.listRows<NoteRow>({
    ...target,
    queries: [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
    ],
  });

  return result.rows.map(toNote);
}


export async function createNote(
  draft: NoteDraft
): Promise<Note> {

  const userId = await getCurrentUserId();

 const row = await tablesDB.createRow<NoteRow>({
  ...target,
  rowId: ID.unique(),
  data: {
    ...draft,
    userId,
  },
  permissions: [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ],
});

  return toNote(row);
}


export async function updateNote(
  id: string,
  draft: NoteDraft
): Promise<Note> {

const row = await tablesDB.updateRow<NoteRow>({
  ...target,
  rowId: id,
  data: draft,
});
  return toNote(row);
}


export async function deleteNote(
  id: string
): Promise<void> {

  await tablesDB.deleteRow({
    ...target,
    rowId: id,
  });
}