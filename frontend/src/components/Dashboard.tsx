import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
import Flashcard from './Flashcard';
import type { FlashcardData } from '../types/flashcard';
import './Dashboard.css';

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  // Load flashcards from localStorage on component mount
  useEffect(() => {
    const savedFlashcards = localStorage.getItem('flashcards');
    if (savedFlashcards) {
      try {
        const parsed = JSON.parse(savedFlashcards);
        // Convert date strings back to Date objects
        const flashcardsWithDates = parsed.map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt)
        }));
        setFlashcards(flashcardsWithDates);
      } catch (error) {
        console.error('Error loading flashcards:', error);
      }
    }
  }, []);

  // Save flashcards to localStorage whenever flashcards change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const handleAddFlashcard = () => {
    if (newFront.trim() && newBack.trim()) {
      const newFlashcard: FlashcardData = {
        id: Date.now().toString(),
        front: newFront.trim(),
        back: newBack.trim(),
        createdAt: new Date()
      };
      setFlashcards(prev => [newFlashcard, ...prev]);
      setNewFront('');
      setNewBack('');
      setIsAddingNew(false);
    }
  };

  const handleUpdateFlashcard = (id: string, front: string, back: string) => {
    setFlashcards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, front, back } : card
      )
    );
  };

  const handleDeleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const cancelAddNew = () => {
    setNewFront('');
    setNewBack('');
    setIsAddingNew(false);
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
              onClick={() => setIsAddingNew(true)}
              className="add-flashcard-btn"
            >
              + Add New Flashcard
            </button>
          </div>

          {isAddingNew && (
            <div className="new-flashcard-form">
              <h3>Create New Flashcard</h3>
              <div className="form-group">
                <label htmlFor="new-front">Front Side</label>
                <textarea
                  id="new-front"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="Enter the front side of your flashcard..."
                  className="form-textarea"
                  rows={3}
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
                  rows={3}
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
                  onClick={cancelAddNew}
                  className="cancel-new-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flashcards-grid">
            {flashcards.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No flashcards yet</h3>
                <p>Create your first flashcard to get started!</p>
                <button 
                  onClick={() => setIsAddingNew(true)}
                  className="create-first-btn"
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
