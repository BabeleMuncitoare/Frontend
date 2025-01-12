'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './dashboardstudent.css';

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`); 
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const DashboardStudent = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    document.cookie = 'userType=; Max-Age=0; path=/;';
    router.push('/');
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = getCookie('accessToken');
      const userRole = getCookie('userType');

      if (!authToken || userRole !== 'student') {
        setError('Acces neautorizat. Veți fi redirecționat.');
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        setError('');
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Prevent back navigation
    const addDummyHistory = () => {
      window.history.pushState(null, '', window.location.href);
    };

    const preventBackNavigation = () => {
      addDummyHistory();
      window.onpopstate = () => {
        addDummyHistory();
        alert('Navigarea înapoi nu este permisă. Pentru a ieși, folosiți butonul "Deconectare".');
      };
    };

    preventBackNavigation();

    return () => {
      window.onpopstate = null; // Cleanup
    };
  }, [router]);

  if (isLoading) {
    return <div>Se încarcă...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div onClick={() => router.push('/dashboardstudent')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <ul>
          <li>
            <div
              className="menu-icon-container"
              onClick={() => router.push('/calendarstudent')}
              style={{ cursor: 'pointer' }}
            >
              <img src="/calendar.png" alt="Calendar" className="menu-icon" />
              <div className="menu-tooltip">Calendar</div>
            </div>
          </li>
        </ul>
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            <img src="/logout.png" alt="Logout Icon" className="menu-icon" />
            <div className="menu-tooltip">Deconectare</div>
          </button>
        </div>
      </div>

      <div className="content">
        <div className="announcements">
          <div className="announcement">Anunț 1 - Verifică programările.</div>
          <div className="announcement">Anunț 2 - Actualizări în orar.</div>
          <div className="announcement">Anunț 3 - Modificări administrative.</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
