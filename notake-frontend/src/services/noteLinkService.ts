import api from './api';

export interface NoteLink {
  id: number;
  sourceNoteId: number;
  targetNoteId: number;
  createdAt: string;
}

export interface NoteLinkRequest {
  sourceNoteId: number;
  targetNoteId: number;
}

const noteLinkService = {
  // Get all note links for the current user
  getAllLinks: async (): Promise<NoteLink[]> => {
    const response = await api.get<NoteLink[]>('/note-links');
    return response.data;
  },

  // Create a new link between notes
  createLink: async (sourceNoteId: number, targetNoteId: number): Promise<NoteLink> => {
    const response = await api.post<NoteLink>('/note-links', {
      sourceNoteId,
      targetNoteId
    });
    return response.data;
  },

  // Delete a link
  deleteLink: async (linkId: number): Promise<void> => {
    await api.delete(`/note-links/${linkId}`);
  }
};

export default noteLinkService;
