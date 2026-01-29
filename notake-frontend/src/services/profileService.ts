import api from './api';

export interface ProfileData {
  id: number;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  dateOfBirth?: string;
  memberSince: string;
  totalNotes: number;
  totalFiles: number;
  totalBoardLinks: number;
}

export interface ProfileUpdateRequest {
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  dateOfBirth?: string;
}

const profileService = {
  // Get current user's profile
  getProfile: async (): Promise<ProfileData> => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update profile information
  updateProfile: async (data: ProfileUpdateRequest): Promise<ProfileData> => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (file: File): Promise<ProfileData> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default profileService;
