import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logo from '../assets/notake-logo.svg';
import authService from '../services/authService';
import noteService from '../services/noteService';
import type { Note } from '../services/noteService';

function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteForm, setNoteForm] = useState<Note>({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    loadNotes();
  }, [navigate]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await noteService.getAllNotes();
      setNotes(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await noteService.createNote(noteForm);
      setNoteForm({ title: '', content: '' });
      setShowCreateModal(false);
      loadNotes();
    } catch (err: any) {
      setError('Failed to create note');
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote?.id) return;
    
    try {
      await noteService.updateNote(editingNote.id, noteForm);
      setNoteForm({ title: '', content: '' });
      setEditingNote(null);
      loadNotes();
    } catch (err: any) {
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await noteService.deleteNote(id);
      loadNotes();
    } catch (err: any) {
      setError('Failed to delete note');
    }
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadNotes();
      return;
    }
    
    try {
      const results = await noteService.searchNotes(searchQuery);
      setNotes(results);
    } catch (err: any) {
      setError('Search failed');
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingNote(null);
    setNoteForm({ title: '', content: '' });
  };

  return (
    <div className="dashboard-section">
      <a href="#" className="logo" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
        <img src={logo} alt="NOTAKE" />
      </a>
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="user-info">
            <h2>Welcome, {user?.fullName || user?.username}!</h2>
            <p className="user-email">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-logout">
            <i className="uil uil-sign-out-alt"></i> Logout
          </button>
        </div>

        <div className="dashboard-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search notes..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn btn-search">
              <i className="uil uil-search"></i>
            </button>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-create">
            <i className="uil uil-plus"></i> New Note
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-message">Loading notes...</div>
        ) : (
          <div className="notes-grid">
            {notes.length === 0 ? (
              <div className="empty-state">
                <i className="uil uil-notes empty-icon"></i>
                <h3>No notes yet</h3>
                <p>Create your first note to get started!</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <h3 className="note-title">{note.title}</h3>
                    <div className="note-actions">
                      <button
                        onClick={() => handleEditClick(note)}
                        className="icon-btn"
                        title="Edit"
                      >
                        <i className="uil uil-edit"></i>
                      </button>
                      <button
                        onClick={() => note.id && handleDeleteNote(note.id)}
                        className="icon-btn delete-btn"
                        title="Delete"
                      >
                        <i className="uil uil-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                  <p className="note-content">{note.content}</p>
                  <div className="note-footer">
                    <span className="note-date">
                      {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingNote) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
              <button onClick={closeModal} className="close-btn">
                <i className="uil uil-times"></i>
              </button>
            </div>
            <form onSubmit={editingNote ? handleUpdateNote : handleCreateNote}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-style"
                  placeholder="Note Title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  required
                />
                <i className="input-icon uil uil-book-alt"></i>
              </div>
              <div className="form-group mt-2">
                <textarea
                  className="form-style textarea-style"
                  placeholder="Note Content"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  rows={6}
                  required
                />
                <i className="input-icon uil uil-file-alt"></i>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn">
                  {editingNote ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
