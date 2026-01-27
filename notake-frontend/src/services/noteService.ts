import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

class NoteService {
  private getAuthHeader() {
    const token = authService.getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getAllNotes(): Promise<Note[]> {
    const response = await axios.get<Note[]>(
      `${API_URL}/notes`,
      this.getAuthHeader()
    );
    return response.data;
  }

  async getNoteById(id: number): Promise<Note> {
    const response = await axios.get<Note>(
      `${API_URL}/notes/${id}`,
      this.getAuthHeader()
    );
    return response.data;
  }

  async createNote(note: Note): Promise<Note> {
    const response = await axios.post<Note>(
      `${API_URL}/notes`,
      note,
      this.getAuthHeader()
    );
    return response.data;
  }

  async updateNote(id: number, note: Note): Promise<Note> {
    const response = await axios.put<Note>(
      `${API_URL}/notes/${id}`,
      note,
      this.getAuthHeader()
    );
    return response.data;
  }

  async deleteNote(id: number): Promise<void> {
    await axios.delete(
      `${API_URL}/notes/${id}`,
      this.getAuthHeader()
    );
  }
}

export default new NoteService();
