import { useState } from 'react';
import './Board.css';

interface NoteNode {
  id: number;
  title: string;
  content: string;
  x: number;
  y: number;
  color: string;
  connections: number[];
}

function Board() {
  const [viewMode, setViewMode] = useState<'graph' | 'cards'>('graph');
  const [notes, setNotes] = useState<NoteNode[]>([
    {
      id: 1,
      title: 'Getting Started',
      content: 'Welcome to your note board! Connect your ideas visually.',
      x: 100,
      y: 100,
      color: '#06b6d4',
      connections: [2],
    },
    {
      id: 2,
      title: 'Project Ideas',
      content: 'Brainstorm and link related concepts together.',
      x: 400,
      y: 150,
      color: '#8b5cf6',
      connections: [3],
    },
    {
      id: 3,
      title: 'Implementation',
      content: 'Break down your ideas into actionable steps.',
      x: 700,
      y: 100,
      color: '#f59e0b',
      connections: [],
    },
  ]);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, noteId: number) => {
    if (viewMode !== 'graph') return;
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

  const renderConnections = () => {
    return notes.flatMap(note =>
      note.connections.map(targetId => {
        const target = notes.find(n => n.id === targetId);
        if (!target) return null;
        
        return (
          <line
            key={`${note.id}-${targetId}`}
            x1={note.x + 80}
            y1={note.y + 60}
            x2={target.x + 80}
            y2={target.y + 60}
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      })
    );
  };

  return (
    <div className="board-section">
      <div className="board-container">
        <div className="board-header">
          <div>
            <h1>Board</h1>
            <p className="board-subtitle">Visualize and connect your notes</p>
          </div>
          <div className="board-controls">
            <button
              className={`view-mode-btn ${viewMode === 'graph' ? 'active' : ''}`}
              onClick={() => setViewMode('graph')}
            >
              <i className="uil uil-sitemap"></i>
              <span>Graph View</span>
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <i className="uil uil-apps"></i>
              <span>Card View</span>
            </button>
          </div>
        </div>

        {viewMode === 'graph' ? (
          <div
            className="graph-view"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg className="connections-layer">
              {renderConnections()}
            </svg>
            
            {notes.map((note) => (
              <div
                key={note.id}
                className={`note-node ${selectedNote === note.id ? 'selected' : ''}`}
                style={{
                  left: note.x,
                  top: note.y,
                  borderColor: note.color,
                }}
                onMouseDown={(e) => handleMouseDown(e, note.id)}
                onClick={() => setSelectedNote(note.id)}
              >
                <div className="node-header" style={{ background: note.color }}>
                  <h3 className="node-title">{note.title}</h3>
                  <div className="node-actions">
                    <button className="node-btn" title="Link">
                      <i className="uil uil-link"></i>
                    </button>
                    <button className="node-btn" title="Edit">
                      <i className="uil uil-edit"></i>
                    </button>
                  </div>
                </div>
                <div className="node-content">
                  <p>{note.content}</p>
                </div>
                <div className="node-footer">
                  <span className="connection-count">
                    <i className="uil uil-arrow-right"></i>
                    {note.connections.length} links
                  </span>
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
                      {note.connections.length}
                    </span>
                  </div>
                </div>
              ))}
              
              <button className="add-note-card">
                <i className="uil uil-plus"></i>
                <span>Add New Note</span>
              </button>
            </div>
          </div>
        )}

        {selectedNote !== null && viewMode === 'graph' && (
          <div className="node-details-panel">
            <div className="panel-header">
              <h3>Note Details</h3>
              <button
                className="close-panel"
                onClick={() => setSelectedNote(null)}
              >
                <i className="uil uil-times"></i>
              </button>
            </div>
            <div className="panel-content">
              {(() => {
                const note = notes.find(n => n.id === selectedNote);
                if (!note) return null;
                return (
                  <>
                    <div className="detail-group">
                      <label>Title</label>
                      <div className="detail-value">{note.title}</div>
                    </div>
                    <div className="detail-group">
                      <label>Content</label>
                      <div className="detail-value">{note.content}</div>
                    </div>
                    <div className="detail-group">
                      <label>Connections</label>
                      <div className="detail-value">
                        {note.connections.length === 0
                          ? 'No connections'
                          : `Connected to ${note.connections.length} note(s)`}
                      </div>
                    </div>
                    <div className="panel-actions">
                      <button className="btn-panel">
                        <i className="uil uil-edit"></i>
                        Edit
                      </button>
                      <button className="btn-panel btn-link">
                        <i className="uil uil-link"></i>
                        Link Note
                      </button>
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
