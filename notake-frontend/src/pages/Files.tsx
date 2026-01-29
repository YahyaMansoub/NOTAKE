import { useState, useEffect } from 'react';
import fileService from '../services/fileService';
import type { FileData } from '../services/fileService';
import './Files.css';

function Files() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fileService.getAllFiles();
      setFiles(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    try {
      setUploading(true);
      setError('');
      
      const fileArray = Array.from(uploadedFiles);
      const responses = await fileService.uploadMultipleFiles(fileArray);
      
      setFiles([...responses, ...files]);
    } catch (err: any) {
      setError('Failed to upload files');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'document': return 'uil-file-alt';
      case 'image': return 'uil-image';
      case 'video': return 'uil-video';
      case 'audio': return 'uil-music';
      default: return 'uil-file';
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await fileService.deleteFile(id);
      setFiles(files.filter(file => file.id !== id));
    } catch (err: any) {
      setError('Failed to delete file');
      console.error(err);
    }
  };

  const handleDownloadFile = async (file: FileData) => {
    try {
      const blob = await fileService.downloadFile(file.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download file');
      console.error(err);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.originalFileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || file.category.toLowerCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="files-section">
        <div className="files-container">
          <div className="loading-message">Loading files...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="files-section">
      <div className="files-container">
        <div className="files-header">
          <div>
            <h1>Files</h1>
            <p className="files-subtitle">Manage all your uploaded files</p>
          </div>
          <label htmlFor="file-upload" className={`btn-upload-file ${uploading ? 'uploading' : ''}`}>
            <i className="uil uil-cloud-upload"></i>
            <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </div>

        <div className="files-controls">
          <div className="search-filter-group">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search files..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="uil uil-search search-icon"></i>
            </div>

            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <i className="uil uil-apps"></i>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <i className="uil uil-list-ul"></i>
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="files-stats">
          <div className="stat-item">
            <i className="uil uil-file"></i>
            <div>
              <div className="stat-value">{files.length}</div>
              <div className="stat-label">Total Files</div>
            </div>
          </div>
          <div className="stat-item">
            <i className="uil uil-file-alt"></i>
            <div>
              <div className="stat-value">{files.filter(f => f.category === 'DOCUMENT').length}</div>
              <div className="stat-label">Documents</div>
            </div>
          </div>
          <div className="stat-item">
            <i className="uil uil-image"></i>
            <div>
              <div className="stat-value">{files.filter(f => f.category === 'IMAGE').length}</div>
              <div className="stat-label">Images</div>
            </div>
          </div>
          <div className="stat-item">
            <i className="uil uil-video"></i>
            <div>
              <div className="stat-value">{files.filter(f => f.category === 'VIDEO').length}</div>
              <div className="stat-label">Videos</div>
            </div>
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <i className="uil uil-folder-open empty-icon"></i>
            <h3>No files yet</h3>
            <p>Upload your first file to get started!</p>
          </div>
        ) : (
          <div className={`files-${viewMode}`}>
            {filteredFiles.map((file) => (
              <div key={file.id} className="file-card">
                <div className="file-icon-wrapper">
                  <i className={`uil ${getCategoryIcon(file.category)} file-icon`}></i>
                </div>
                <div className="file-details">
                  <h3 className="file-name" title={file.originalFileName}>{file.originalFileName}</h3>
                  <div className="file-meta">
                    <span className="file-size">{fileService.formatFileSize(file.fileSize)}</span>
                    <span className="file-date">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="file-actions">
                  <button 
                    className="icon-btn" 
                    title="Download"
                    onClick={() => handleDownloadFile(file)}
                  >
                    <i className="uil uil-download-alt"></i>
                  </button>
                  <button className="icon-btn" title="Share">
                    <i className="uil uil-share-alt"></i>
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    title="Delete"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <i className="uil uil-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;
