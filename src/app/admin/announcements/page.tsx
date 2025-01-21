'use client';

import React, { useEffect, useState } from 'react';
import {
  fetchAdminAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from '@/app/services/adminService';
import './announcements.css';
import {Announcement} from '@/app/services/interfaces';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAdminAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to fetch announcements. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Adaugă un anunț
  const handleAddAnnouncement = async () => {
    // Verificăm dacă titlul și conținutul sunt goale
    if (!newAnnouncement.title || !newAnnouncement.content) {
      setError('Both title and content are required.');
      return;
    }
  
    // Verificăm lungimea maximă a titlului
    if (newAnnouncement.title.length > 255) {
      setError('Title cannot exceed 255 characters.');
      return;
    }
  
    try {
      // Trimiterea datelor către backend
      const createdAnnouncement = await createAnnouncement({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
      });
  
      // Adăugăm anunțul nou în listă și resetăm formularul
      setAnnouncements((prev) => [...prev, createdAnnouncement]);
      setNewAnnouncement({ title: '', content: '' });
      setSuccess('Announcement added successfully!');
      setError('');
    } catch (err) {
      console.error('Error adding announcement:', err);
  
      // Gestionarea erorilor
      if (err instanceof Error) {
        setError(err.message || 'Failed to add announcement. Please try again later.');
      } else {
        setError('An unknown error occurred. Please try again later.');
      }
      setSuccess('');
    }
  };

  // Șterge un anunț
  const handleDeleteAnnouncement = async (id: number) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
      setSuccess('Announcement deleted successfully!');
      setError('');
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement. Please try again later.');
      setSuccess('');
    }
  };

  // Modifică un anunț
  const handleEditAnnouncement = async () => {
    if (!editAnnouncement?.title || !editAnnouncement.content) {
      setError('Both title and content are required for editing.');
      return;
    }
    try {
      const updatedAnnouncement = await updateAnnouncement(editAnnouncement);
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === updatedAnnouncement.id ? updatedAnnouncement : announcement
        )
      );
      setEditAnnouncement(null);
      setSuccess('Announcement updated successfully!');
      setError('');
    } catch (err) {
      console.error('Error updating announcement:', err);
      setError('Failed to update announcement. Please try again later.');
      setSuccess('');
    }
  };

  return (
    <div className="announce-management">
      <h1 className="announcement">Anunțuri</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Adaugare anunț */}
      <div className="add-announcement">
        <h3>Adaugare anunț</h3>
        <input
          type="text"
          placeholder="Titlu"
          value={newAnnouncement.title}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
        />
        <textarea
          placeholder="Conținut"
          value={newAnnouncement.content}
          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
        />
        <button onClick={handleAddAnnouncement} className="add-btn">
          Adaugă
        </button>
      </div>

      {/* Lista de anunțuri */}
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement.id}>
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
            <button onClick={() => setEditAnnouncement(announcement)} className="edit-btn">
              Editare
            </button>
            <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="delete-btn">
              Ștergere
            </button>
          </li>
        ))}
      </ul>

      {/* Modificare anunț */}
      {editAnnouncement && (
        <div className="edit-announcement">
          <h3>Editare anunț</h3>
          <input
            type="text"
            placeholder="Titlu"
            value={editAnnouncement.title}
            onChange={(e) =>
              setEditAnnouncement({ ...editAnnouncement, title: e.target.value } as Announcement)
            }
          />
          <textarea
            placeholder="Conținut"
            value={editAnnouncement.content}
            onChange={(e) =>
              setEditAnnouncement({ ...editAnnouncement, content: e.target.value } as Announcement)
            }
          />
          <button onClick={handleEditAnnouncement} className="update-btn">
            Actualizare
          </button>
          <button onClick={() => setEditAnnouncement(null)} className="cancel-btn">
            Anulare
          </button>
        </div>
      )}
    </div>
  );
}
