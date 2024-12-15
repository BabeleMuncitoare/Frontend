'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './dashboardstudent.css';

const DashboardStudent = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Pentru afișarea stării de încărcare
  const [error, setError] = useState('');

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      // Verifică autentificarea și rolul utilizatorului
      const isLoggedIn = document.cookie.includes('isLoggedIn=true');
      const userRole = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userRole='))
        ?.split('=')[1]; // Extrage rolul utilizatorului din cookie

      if (!isLoggedIn || userRole !== 'student') {
        setError('Acces neautorizat. Veți fi redirecționat.');
        setTimeout(() => {
          router.push('/'); // Redirecționează la pagina principală după 2 secunde
        }, 2000);
      } else {
        setError(''); // Resetează erorile
        setIsLoading(false); // Termină starea de încărcare
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleLogout = () => {
    // Șterge cookie-urile pentru autentificare
    document.cookie = 'isLoggedIn=; Max-Age=0; path=/;';
    document.cookie = 'userRole=; Max-Age=0; path=/;';
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
              onClick={() => handleNavigation('/calendarstudent')} // Navigare corectă
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
              onClick={() => handleNavigation('/courses')} // Navigare corectă
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
              onClick={() => handleNavigation('/settings')} // Navigare 
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
