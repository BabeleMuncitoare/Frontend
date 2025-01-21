'use client';

const API_URL = "https://bigbaba.yirade.dev/api";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './dashboardteacher.css';
import { Announcement } from '@/app/services/interfaces';


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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); // Starea pentru anunțuri

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

      if (!authToken || userRole !== 'professor') {
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

    fetchAnnouncements();
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
        <div onClick={() => router.push('/dashboardteacher')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <ul>
          <li>
            <div
              className="menu-icon-container"
              onClick={() => router.push('/calendarteacher')}
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

      <div className='content-teacher'>
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
    </div>
  );
};

export default DashboardTeacher;
