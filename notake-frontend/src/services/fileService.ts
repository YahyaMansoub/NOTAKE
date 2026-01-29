import api from './api';

export interface FileData {
  id: number;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  category: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'OTHER';
  uploadDate: string;
}

const fileService = {
  // Upload a single file
  uploadFile: async (file: File): Promise<FileData> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple files
  uploadMultipleFiles: async (files: File[]): Promise<FileData[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all files for current user
  getAllFiles: async (): Promise<FileData[]> => {
    const response = await api.get('/files');
    return response.data;
  },

  // Download a file
  downloadFile: async (fileId: number): Promise<Blob> => {
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete a file
  deleteFile: async (fileId: number): Promise<void> => {
    await api.delete(`/files/${fileId}`);
  },

  // Get file download URL
  getFileDownloadUrl: (fileId: number): string => {
    return `${import.meta.env.VITE_API_URL}/files/download/${fileId}`;
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  },
};

export default fileService;
