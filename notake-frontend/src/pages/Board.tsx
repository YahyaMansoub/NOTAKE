import { useState, useEffect } from 'react';
import noteService, { type Note } from '../services/noteService';
import noteLinkService, { type NoteLink } from '../services/noteLinkService';
import './Board.css';

interface NoteNode extends Note {
  x: number;
  y: number;
  color: string;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#ec4899'];

function Board() {
  const [viewMode, setViewMode] = useState<'graph' | 'cards'>('graph');
  const [notes, setNotes] = useState<NoteNode[]>([]);
  const [links, setLinks] = useState<NoteLink[]>([]);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkingMode, setLinkingMode] = useState(false);
  const [linkSource, setLinkSource] = useState<number | null>(null);

  useEffect(() => {
    loadBoardData();
  }, []);

  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [notesData, linksData] = await Promise.all([
        noteService.getAllNotes(),
        noteLinkService.getAllLinks()
      ]);

      // Convert notes to nodes with positions and colors
      const nodes: NoteNode[] = notesData.map((note, index) => {
        // Generate grid-like positions
        const col = index % 4;
        const row = Math.floor(index / 4);
        
        return {
          ...note,
          x: 100 + col * 250,
          y: 100 + row * 200,
          color: COLORS[index % COLORS.length]
        };
      });

      setNotes(nodes);
      setLinks(linksData);
    } catch (err: any) {
      setError('Failed to load board data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, noteId: number) => {
    if (viewMode !== 'graph') return;
    
    if (linkingMode) {
      handleNoteClickForLinking(noteId);
      return;
    }
    
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    setDragging(noteId);
    setDragOffset({
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging === null || viewMode !== 'graph') return;
    
    setNotes(notes.map(note =>
      note.id === dragging
        ? { ...note, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
        : note
    ));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleNoteClickForLinking = async (noteId: number) => {
    if (linkSource === null) {
      // First note selected as source
      setLinkSource(noteId);
    } else if (linkSource === noteId) {
      // Clicked same note, deselect
      setLinkSource(null);
    } else {
      // Second note selected, create link
      try {
        const newLink = await noteLinkService.createLink(linkSource, noteId);
        setLinks([...links, newLink]);
        setLinkSource(null);
        setLinkingMode(false);
      } catch (err: any) {
        if (err.response?.status === 409) {
          alert('Link already exists between these notes');
        } else {
          alert('Failed to create link');
        }
        setLinkSource(null);
      }
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!confirm('Delete this connection?')) return;
    
    try {
      await noteLinkService.deleteLink(linkId);
      setLinks(links.filter(link => link.id !== linkId));
    } catch (err) {
      alert('Failed to delete link');
    }
  };

  const toggleLinkingMode = () => {
    setLinkingMode(!linkingMode);
    setLinkSource(null);
  };

  const renderConnections = () => {
    return links.map(link => {
      const sourceNote = notes.find(n => n.id === link.sourceNoteId);
      const targetNote = notes.find(n => n.id === link.targetNoteId);
      
      if (!sourceNote || !targetNote) return null;
      
      const midX = (sourceNote.x + targetNote.x) / 2 + 80;
      const midY = (sourceNote.y + targetNote.y) / 2 + 60;
      
      return (
        <g key={link.id}>
          <line
            x1={sourceNote.x + 80}
            y1={sourceNote.y + 60}
            x2={targetNote.x + 80}
            y2={targetNote.y + 60}
            stroke="rgba(6, 182, 212, 0.6)"
            strokeWidth="2"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
          />
          <circle
            cx={midX}
            cy={midY}
            r="8"
            fill="#ef4444"
            opacity="0.8"
            cursor="pointer"
            onClick={() => handleDeleteLink(link.id)}
            className="delete-link-btn"
          >
            <title>Click to delete connection</title>
          </circle>
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            pointerEvents="none"
          >
            ×
          </text>
        </g>
      );
    });
  };

  if (loading) {
    return (
      <div className="board-section">
        <div className="board-container">
          <div className="loading-message">Loading your notes...</div>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="board-section">
        <div className="board-container">
          <div className="board-header">
            <h1>Board</h1>
            <p className="board-subtitle">Visual graph of your notes</p>
          </div>
          <div className="empty-state">
            <i className="uil uil-graph-bar"></i>
            <p>No notes yet!</p>
            <p className="empty-state-subtitle">
              Create some notes first to see them here in graph view
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="board-section">
      <div className="board-container">
        <div className="board-header">
          <div>
            <h1>Board</h1>
            <p className="board-subtitle">
              {linkingMode 
                ? linkSource 
                  ? 'Click another note to create a connection' 
                  : 'Click a note to start linking'
                : 'Visualize and connect your ideas'}
            </p>
          </div>
          <div className="board-controls">
            <button
              className={`link-mode-btn ${linkingMode ? 'active' : ''}`}
              onClick={toggleLinkingMode}
              title={linkingMode ? 'Exit linking mode' : 'Create links between notes'}
            >
              <i className="uil uil-link"></i>
              {linkingMode ? 'Cancel Linking' : 'Link Notes'}
            </button>
            <div className="view-toggle">
              <button
                className={viewMode === 'graph' ? 'active' : ''}
                onClick={() => setViewMode('graph')}
                title="Graph view"
              >
                <i className="uil uil-graph-bar"></i>
              </button>
              <button
                className={viewMode === 'cards' ? 'active' : ''}
                onClick={() => setViewMode('cards')}
                title="Card view"
              >
                <i className="uil uil-apps"></i>
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {viewMode === 'graph' ? (
          <div
            className="graph-view"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <svg className="connections-layer">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill="rgba(6, 182, 212, 0.6)"
                  />
                </marker>
              </defs>
              {renderConnections()}
            </svg>
            
            {notes.map(note => (
              <div
                key={note.id}
                className={`note-node ${dragging === note.id ? 'dragging' : ''} ${
                  linkSource === note.id ? 'link-source' : ''
                } ${linkingMode ? 'linking-mode' : ''}`}
                style={{
                  left: `${note.x}px`,
                  top: `${note.y}px`,
                  borderColor: note.color,
                }}
                onMouseDown={(e) => handleMouseDown(e, note.id!)}
                onClick={() => !dragging && setSelectedNote(note.id!)}
              >
                <div className="note-node-header" style={{ background: note.color }}>
                  <h3>{note.title}</h3>
                </div>
                <div className="note-node-content">
                  <p>{note.content.substring(0, 80)}{note.content.length > 80 ? '...' : ''}</p>
                </div>
              </div>
            ))}

            <div className="graph-hint">
              <i className="uil uil-info-circle"></i>
              <span>Drag notes to reposition • Click to select • Use link button to connect</span>
            </div>
          </div>
        ) : (
          <div className="cards-view">
            <div className="cards-grid">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="board-card"
                  style={{ borderTop: `4px solid ${note.color}` }}
                >
                  <div className="card-header">
                    <h3 className="card-title">{note.title}</h3>
                    <div className="card-actions">
                      <button className="icon-btn" title="Link">
                        <i className="uil uil-link"></i>
                      </button>
                      <button className="icon-btn" title="Edit">
                        <i className="uil uil-edit"></i>
                      </button>
                      <button className="icon-btn delete-btn" title="Delete">
                        <i className="uil uil-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                  <p className="card-content">{note.content}</p>
                  <div className="card-footer">
                    <div className="card-color" style={{ background: note.color }}></div>
                    <span className="connection-badge">
                      <i className="uil uil-arrow-right"></i>
                      {links.filter(l => l.sourceNoteId === note.id || l.targetNoteId === note.id).length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedNote && (
          <div className="note-details-panel" onClick={() => setSelectedNote(null)}>
            <div className="note-details-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedNote(null)}>
                <i className="uil uil-times"></i>
              </button>
              {(() => {
                const note = notes.find(n => n.id === selectedNote);
                if (!note) return null;
                const noteLinks = links.filter(
                  l => l.sourceNoteId === note.id || l.targetNoteId === note.id
                );
                
                return (
                  <>
                    <h2>{note.title}</h2>
                    <div className="note-content-full">
                      <p>{note.content}</p>
                    </div>
                    <div className="note-metadata">
                      <p>
                        <i className="uil uil-clock"></i>
                        Created: {new Date(note.createdAt!).toLocaleDateString()}
                      </p>
                      <p>
                        <i className="uil uil-link"></i>
                        {noteLinks.length} connection{noteLinks.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
