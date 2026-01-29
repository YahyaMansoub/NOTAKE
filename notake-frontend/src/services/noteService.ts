import api from './api';

export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

class NoteService {
  async getAllNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  }

  async getNoteById(id: number): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  }

  async createNote(note: Note): Promise<Note> {
    const response = await api.post<Note>('/notes', note);
    return response.data;
  }

  async updateNote(id: number, note: Note): Promise<Note> {
    const response = await api.put<Note>(`/notes/${id}`, note);
    return response.data;
  }

  async deleteNote(id: number): Promise<void> {
    await api.delete(`/notes/${id}`);
  }

  async searchNotes(keyword: string): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes/search', {
      params: { keyword },
    });
    return response.data;
  }

  async getNotesCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/notes/count');
    return response.data.count;
  }
}

export default new NoteService();
