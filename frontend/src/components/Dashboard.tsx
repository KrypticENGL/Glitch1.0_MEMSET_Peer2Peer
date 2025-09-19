import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
import Flashcard from './Flashcard';
import Modal from './Modal';
import type { FlashcardData } from '../types/flashcard';
import { 
  addFlashcard, 
  updateFlashcard, 
  deleteFlashcard, 
  getUserFlashcards 
} from '../services/firestoreService';
import './Dashboard.css';

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load flashcards from Firestore on component mount
  useEffect(() => {
    const loadFlashcards = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userFlashcards = await getUserFlashcards(user.uid);
        setFlashcards(userFlashcards);
      } catch (err) {
        console.error('Error loading flashcards:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [user?.uid]);

  const handleAddFlashcard = async () => {
    if (!newFront.trim() || !newBack.trim() || !user?.uid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const flashcardId = await addFlashcard(
        {
          front: newFront.trim(),
          back: newBack.trim(),
          userId: user.uid
        },
        user.uid
      );
      
      const newFlashcard: FlashcardData = {
        id: flashcardId,
        front: newFront.trim(),
        back: newBack.trim(),
        createdAt: new Date(),
        userId: user.uid
      };
      
      setFlashcards(prev => [newFlashcard, ...prev]);
      setNewFront('');
      setNewBack('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding flashcard:', err);
      setError('Failed to add flashcard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFlashcard = async (id: string, front: string, back: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateFlashcard(id, { front, back });
      setFlashcards(prev => 
        prev.map(card => 
          card.id === id ? { ...card, front, back } : card
        )
      );
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setError('Failed to update flashcard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteFlashcard(id);
      setFlashcards(prev => prev.filter(card => card.id !== id));
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      setError('Failed to delete flashcard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCloseModal = () => {
    setNewFront('');
    setNewBack('');
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📚 Flashcard Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.displayName || user.email}!</span>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="flashcards-header">
            <h2>Your Flashcards ({flashcards.length})</h2>
            <button 
              onClick={handleOpenModal}
              className="add-flashcard-btn"
              disabled={loading}
            >
              {loading ? 'Loading...' : '+ Add New Flashcard'}
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="error-close">
                ×
              </button>
            </div>
          )}

          {loading && flashcards.length === 0 && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your flashcards...</p>
            </div>
          )}


          {!loading && (
            <div className="flashcards-grid">
              {flashcards.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No flashcards yet</h3>
                  <p>Create your first flashcard to get started!</p>
                  <button 
                    onClick={handleOpenModal}
                    className="create-first-btn"
                    disabled={loading}
                  >
                    Create Your First Flashcard
                  </button>
                </div>
              ) : (
                flashcards.map(flashcard => (
                  <Flashcard
                    key={flashcard.id}
                    flashcard={flashcard}
                    onUpdate={handleUpdateFlashcard}
                    onDelete={handleDeleteFlashcard}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title="Create New Flashcard"
      >
        <div className="modal-flashcard-form">
          <div className="form-group">
            <label htmlFor="new-front">Front Side</label>
            <textarea
              id="new-front"
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              placeholder="Enter the front side of your flashcard..."
              className="form-textarea"
              rows={4}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-back">Back Side</label>
            <textarea
              id="new-back"
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              placeholder="Enter the back side of your flashcard..."
              className="form-textarea"
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button 
              onClick={handleAddFlashcard}
              className="save-new-btn"
              disabled={!newFront.trim() || !newBack.trim()}
            >
              Create Flashcard
            </button>
            <button 
              onClick={handleCloseModal}
              className="cancel-new-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
