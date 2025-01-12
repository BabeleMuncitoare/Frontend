'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './dashboardteacher.css';

// Funcție pentru a extrage valoarea unui cookie
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const DashboardTeacher = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = getCookie('accessToken'); // Token-ul de acces
      const userRole = getCookie('userType'); // Rolul utilizatorului

      if (!authToken || userRole !== 'professor') {
        setError('Acces neautorizat. Veți fi redirecționat.');
        setTimeout(() => {
          router.push('/'); // Redirecționează la pagina principală
        }, 2000);
      } else {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleLogout = () => {
    // Șterge cookie-urile pentru autentificare
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    document.cookie = 'userType=; Max-Age=0; path=/;';
    router.push('/'); // Redirecționează la pagina de login
  };

  if (isLoading) {
    return <div>Se încarcă...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div onClick={() => handleNavigation('/dashboardteacher')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <ul>
          {/* Calendar Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={() => handleNavigation('/calendarteacher')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/calendar.png" alt="Calendar" className="menu-icon" />
              <div className="menu-tooltip">Calendar</div>
            </div>
          </li>
          {/*}
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
          */}
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
          <div className="announcement">Anunț 1 - Verifică examenele programate.</div>
          <div className="announcement">Anunț 2 - Actualizări în orar.</div>
          <div className="announcement">Anunț 3 - Noutăți despre studenți.</div>
          <div className="announcement">Anunț 4 - Modificări administrative.</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTeacher;
