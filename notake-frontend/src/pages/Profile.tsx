import { useState, useEffect } from 'react';
import profileService from '../services/profileService';
import type { ProfileData } from '../services/profileService';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      console.log('Profile loaded:', data);
      console.log('Profile image URL:', data.profileImageUrl);
      setProfile(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load profile');
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const updatedProfile = await profileService.uploadProfileImage(file);
      console.log('Profile updated with image:', updatedProfile.profileImageUrl);
      setProfile(updatedProfile);
      // Force re-render by updating the key
      window.location.hash = '#reload';
      window.location.hash = '';
    } catch (err: any) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-section">
        <div className="profile-container">
          <div className="loading-message">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-section">
        <div className="profile-container">
          <div className="error-message">{error || 'Profile not found'}</div>
        </div>
      </div>
    );
  }

  const getProfileImageUrl = () => {
    if (profile.profileImageUrl) {
      // Add timestamp to prevent caching issues
      const timestamp = new Date().getTime();
      const fullUrl = `${import.meta.env.VITE_API_URL}${profile.profileImageUrl}?t=${timestamp}`;
      console.log('Profile image full URL:', fullUrl);
      console.log('API URL:', import.meta.env.VITE_API_URL);
      console.log('Image path:', profile.profileImageUrl);
      return fullUrl;
    }
    console.log('No profile image URL found');
    return null;
  };

  const imageKey = (profile.profileImageUrl || 'no-image') + new Date().getTime();

  return (
    <div className="profile-section">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-image-section">
              <div className="profile-image-wrapper">
                {getProfileImageUrl() ? (
                  <img 
                    key={imageKey}
                    src={getProfileImageUrl()!} 
                    alt="Profile" 
                    className="profile-image"
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => {
                      console.error('Failed to load profile image:', getProfileImageUrl());
                      console.error('Image load error event:', e);
                    }}
                  />
                ) : (
                  <div className="profile-image-placeholder">
                    <i className="uil uil-user"></i>
                  </div>
                )}
              </div>
              <label htmlFor="profile-upload" className={`upload-btn ${uploading ? 'uploading' : ''}`}>
                <i className="uil uil-camera"></i>
                <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </div>

            <div className="profile-info-section">
              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-user"></i>
                  Full Name
                </label>
                <div className="info-value">{profile.fullName || 'Not set'}</div>
              </div>

              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-at"></i>
                  Username
                </label>
                <div className="info-value">{profile.username || 'Not set'}</div>
              </div>

              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-envelope"></i>
                  Email
                </label>
                <div className="info-value">{profile.email || 'Not set'}</div>
              </div>

              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-calendar-alt"></i>
                  Member Since
                </label>
                <div className="info-value">
                  {new Date(profile.memberSince).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-shield-check"></i>
                  Account Status
                </label>
                <div className="info-value status-active">
                  <span className="status-indicator"></span>
                  Active
                </div>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon notes-icon">
                <i className="uil uil-notes"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">{profile.totalNotes}</div>
                <div className="stat-label">Total Notes</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon files-icon">
                <i className="uil uil-folder"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">{profile.totalFiles}</div>
                <div className="stat-label">Files Uploaded</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon board-icon">
                <i className="uil uil-sitemap"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">{profile.totalBoardLinks}</div>
                <div className="stat-label">Board Links</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
