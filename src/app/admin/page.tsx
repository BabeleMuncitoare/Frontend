'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './admin.css';

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export default function Admin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    // Șterge cookie-urile de autentificare
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    document.cookie = 'userType=; Max-Age=0; path=/;';
    router.push('/'); // Redirecționează la pagina de autentificare
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = getCookie('accessToken');
      const userRole = getCookie('userType');

      // Verifică autentificarea și rolul utilizatorului
      if (!authToken || userRole !== 'admin') {
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

    // Previne navigarea înapoi
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
    <div className="admin-dashboard">
      <h1 className='admin'>Admin Dashboard</h1>
      <div className="admin-menu">
        <button onClick={() => router.push('/admin/users')}>User Management</button>
        <button onClick={() => router.push('/admin/classes')}>Class Management</button>
        <button onClick={() => router.push('/admin/exams')}>Exam Management</button>
        <button onClick={() => router.push('/admin/announcements')}>Announcements</button>
      </div>
      <div className="admin-logout-container">
        <button className="admin-logout-button" onClick={handleLogout}>
          Deconectare
        </button>
      </div>
    </div>
  );
}
