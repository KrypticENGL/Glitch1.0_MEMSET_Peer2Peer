import React, { useState } from 'react';
import type { FlashcardData } from '../types/flashcard';
import './Flashcard.css';

interface FlashcardProps {
  flashcard: FlashcardData;
  onUpdate: (id: string, front: string, back: string) => void;
  onDelete: (id: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ flashcard, onUpdate, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFront, setEditFront] = useState(flashcard.front);
  const [editBack, setEditBack] = useState(flashcard.back);

  const handleSave = () => {
    if (editFront.trim() && editBack.trim()) {
      onUpdate(flashcard.id, editFront.trim(), editBack.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditFront(flashcard.front);
    setEditBack(flashcard.back);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      onDelete(flashcard.id);
    }
  };

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          {isEditing ? (
            <div className="edit-form">
              <textarea
                value={editFront}
                onChange={(e) => setEditFront(e.target.value)}
                placeholder="Front side of the card..."
                className="edit-textarea"
                rows={4}
              />
              <div className="edit-actions">
                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="card-content">
              <p className="card-text">{flashcard.front}</p>
              <div className="card-actions">
                <button 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flip-btn"
                >
                  {isFlipped ? 'Show Front' : 'Show Back'}
                </button>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flashcard-back">
          {isEditing ? (
            <div className="edit-form">
              <textarea
                value={editBack}
                onChange={(e) => setEditBack(e.target.value)}
                placeholder="Back side of the card..."
                className="edit-textarea"
                rows={4}
              />
              <div className="edit-actions">
                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="card-content">
              <p className="card-text">{flashcard.back}</p>
              <div className="card-actions">
                <button 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flip-btn"
                >
                  Show Front
                </button>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
