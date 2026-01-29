import { useState } from 'react';
import './Files.css';

interface FileItem {
  id: number;
  name: string;
  size: string;
  type: string;
  uploadDate: Date;
  category: 'document' | 'image' | 'video' | 'audio' | 'other';
}

function Files() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      const newFiles: FileItem[] = Array.from(uploadedFiles).map((file, index) => {
        let category: FileItem['category'] = 'other';
        if (file.type.startsWith('image/')) category = 'image';
        else if (file.type.startsWith('video/')) category = 'video';
        else if (file.type.startsWith('audio/')) category = 'audio';
        else if (file.type.includes('pdf') || file.type.includes('document')) category = 'document';

        return {
          id: Date.now() + index,
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type || 'unknown',
          uploadDate: new Date(),
          category,
        };
      });
      setFiles([...newFiles, ...files]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getCategoryIcon = (category: FileItem['category']): string => {
    switch (category) {
      case 'document': return 'uil-file-alt';
      case 'image': return 'uil-image';
      case 'video': return 'uil-video';
      case 'audio': return 'uil-music';
      default: return 'uil-file';
    }
  };

  const handleDeleteFile = (id: number) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter(file => file.id !== id));
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="files-section">
      <div className="files-container">
        <div className="files-header">
          <div>
            <h1>Files</h1>
            <p className="files-subtitle">Manage all your uploaded files</p>
          </div>
          <label htmlFor="file-upload" className="btn-upload-file">
            <i className="uil uil-cloud-upload"></i>
            <span>Upload Files</span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
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
              <div className="stat-value">{files.filter(f => f.category === 'document').length}</div>
              <div className="stat-label">Documents</div>
            </div>
          </div>
          <div className="stat-item">
            <i className="uil uil-image"></i>
            <div>
              <div className="stat-value">{files.filter(f => f.category === 'image').length}</div>
              <div className="stat-label">Images</div>
            </div>
          </div>
          <div className="stat-item">
            <i className="uil uil-video"></i>
            <div>
              <div className="stat-value">{files.filter(f => f.category === 'video').length}</div>
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
                  <h3 className="file-name" title={file.name}>{file.name}</h3>
                  <div className="file-meta">
                    <span className="file-size">{file.size}</span>
                    <span className="file-date">
                      {file.uploadDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="file-actions">
                  <button className="icon-btn" title="Download">
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
