'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './dashboardstudent.css';

// Funcție pentru a extrage valoarea unui cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const DashboardStudent = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Pentru afișarea stării de încărcare
  const [error, setError] = useState('');

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = getCookie('accessToken'); // Extrage token-ul din cookie
      const userRole = getCookie('userType'); // Extrage rolul utilizatorului din cookie

      if (!authToken || userRole !== 'student') {
        setError('Acces neautorizat. Veți fi redirecționat.');
        setTimeout(() => {
          router.push('/'); // Redirecționează la pagina principală după 2 secunde
        }, 2000);
      } else {
        setError('');
        setIsLoading(false); // Termină starea de încărcare
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleLogout = () => {
    // Șterge cookie-urile pentru autentificare
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    document.cookie = 'userType=; Max-Age=0; path=/;';
    router.push('/'); // Navigare la pagina principală
  };

  if (isLoading) {
    return <div>Se încarcă...</div>; // Afișează un mesaj de încărcare
  }

  if (error) {
    return <div>{error}</div>; // Afișează un mesaj de eroare dacă accesul este neautorizat
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div onClick={() => handleNavigation('/dashboardstudent')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <ul>
          {/* Calendar Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={() => handleNavigation('/calendarstudent')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/calendar.png" alt="Calendar" className="menu-icon" />
              <div className="menu-tooltip">Calendar</div>
            </div>
          </li>
          {/* Courses Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={() => handleNavigation('/courses')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/agenda.png" alt="Courses" className="menu-icon" />
              <div className="menu-tooltip">Cursuri</div>
            </div>
          </li>
          {/* Settings Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={() => handleNavigation('/settings')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/settings.png" alt="Settings" className="menu-icon" />
              <div className="menu-tooltip">Setări</div>
            </div>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            <img src="/logout.png" alt="Logout Icon" className="menu-icon" />
            <div className="menu-tooltip">Deconectare</div>
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="content">
        <div className="announcements">
          <div className="announcement">Anunț 1 - Important!</div>
          <div className="announcement">Anunț 2 - Verifică programările.</div>
          <div className="announcement">Anunț 3 - Modificări de sală.</div>
          <div className="announcement">Anunț 4 - Termen limită înscriere.</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
