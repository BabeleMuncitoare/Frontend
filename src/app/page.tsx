'use client';
const API_URL = "https://bigbaba.yirade.dev/api";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const HomePage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); // Starea pentru anunțuri
  const names = ["Ilisei Ciprian", "Cudla Cristian", "Popescu Luis", "Ecoboaea Denis", "Ababi Vlad"];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Fetch all announcements (GET request)
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${API_URL}/announcements/`);
        if (response.ok) {
          const data: Announcement[] = await response.json();
          setAnnouncements(data); // Setează anunțurile în stare
        } else {
          console.error('Error fetching announcements:', response.status);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements(); // Apelăm funcția de fetch când componenta se montează
  }, []); // Se execută o singură dată la montarea componentei

  return (
    <div className="dashboard-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div>
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <ul>
          {/* Info Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={() => setShowModal(true)} // Afișează modalul
              style={{ cursor: 'pointer' }}
            >
              <img src="/info.png" alt="Info" className="menu-icon" />
              <div className="menu-tooltip">Info</div>
            </div>
          </li>
          {/* Auth Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={() => handleNavigation('/login')} // Navigare corectă cu router.push
              style={{ cursor: 'pointer' }}
            >
              <img src="/login.png" alt="Login" className="menu-icon" />
              <div className="menu-tooltip">Conectare la cont</div>
            </div>
          </li>
        </ul>
      </div>

      {/* Main Content Section */}
      <div className="content">
        {/* Title and Description */}
        <div className="main-header">
          <h1 className="main-title">Programarea examenelor</h1>
          <p className="main-description">
            Gestionează programările și află informații importante despre examenele tale.
          </p>
        </div>

        {/* Announcements Section */}
        <div className='content'>
          <div className="announcements-container">
            <div className="announcements">
              {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <div key={index} className="announcement">
                  {/* Afișează titlul și conținutul anunțului */}
                  <h3>{announcement.title}</h3>
                  <p>{announcement.content}</p>
                </div>
              ))
            ) : (
              <div className="announcement">Nu există anunțuri disponibile.</div>
              )}
            </div>
          </div>

        </div>
        {/* Useful Links Section */}
        <div className="useful-links">
          <h2>Link-uri utile</h2>
          <ul>
            <li>
              <a
                href="https://fiesc.usv.ro/wp-content/uploads/sites/17/2024/10/Ghidul_Studentului_FIESC_2024_2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ghidul studentului
              </a>
            </li>
            <li>
              <a>Regulament examene</a>              
            </li>
            <li>
              <a>Întrebări frecvente</a>
            </li>
          </ul>
        </div>

        {/* Modal for Info */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h1>Proiect realizat de:</h1>
              <ul>
                {names.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setShowModal(false)} // Închide modalul
                className="cancel-button"
              >
                Închide
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
