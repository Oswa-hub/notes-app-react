
export type Note = {
  id: string;
  title: string;
  content: string;
};

export type NoteDraft = Pick<Note, 'title' | 'content'>;
