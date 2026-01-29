import { useState } from 'react';
import authService from '../services/authService';
import './Profile.css';

function Profile() {
  const user = authService.getCurrentUser();
  const [profileImage, setProfileImage] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-image-section">
              <div className="profile-image-wrapper">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="profile-image" />
                ) : (
                  <div className="profile-image-placeholder">
                    <i className="uil uil-user"></i>
                  </div>
                )}
              </div>
              <label htmlFor="profile-upload" className="upload-btn">
                <i className="uil uil-camera"></i>
                <span>Change Photo</span>
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div className="profile-info-section">
              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-user"></i>
                  Full Name
                </label>
                <div className="info-value">{user?.fullName || 'Not set'}</div>
              </div>

              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-at"></i>
                  Username
                </label>
                <div className="info-value">{user?.username || 'Not set'}</div>
              </div>

              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-envelope"></i>
                  Email
                </label>
                <div className="info-value">{user?.email || 'Not set'}</div>
              </div>

              <div className="info-group">
                <label className="info-label">
                  <i className="uil uil-calendar-alt"></i>
                  Member Since
                </label>
                <div className="info-value">
                  {new Date().toLocaleDateString('en-US', { 
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
                <div className="stat-value">0</div>
                <div className="stat-label">Total Notes</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon files-icon">
                <i className="uil uil-folder"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">0</div>
                <div className="stat-label">Files Uploaded</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon board-icon">
                <i className="uil uil-sitemap"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">0</div>
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
