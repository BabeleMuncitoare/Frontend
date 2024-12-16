'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import './courses.css';

function ExamFetcher() {
  const router = useRouter();
  const [data, setData] = useState([]); // Starea pentru date
  const [loading, setLoading] = useState(false); // Indicatorul de încărcare
  const [error, setError] = useState(""); // Starea pentru erori
  const [searchTerm, setSearchTerm] = useState(""); // Termenul de căutare

  // Funcție pentru preluarea examenelor din API
  const fetchExams = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/examen/?query=${searchTerm}`);
      console.log("Răspuns API:", response.data);
      setData(response.data);
    } catch (err) {
      setError("Eroare la încărcarea datelor!");
      console.error("Eroare:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Funcție pentru obținerea rolului utilizatorului din cookie-uri
  const getUserRole = (): string | null => {
    const userRole = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userType'))
      ?.split('=')[1];
    return userRole || null;
  };

  // Navigarea către calendarul corespunzător în funcție de rol
  const navigateToCalendar = () => {
    const role = getUserRole();
    if (role === 'student') {
      router.push('/calendarstudent');
    } else if (role === 'professor') {
      router.push('/calendarteacher');
    } else {
      router.push('/'); // Rol necunoscut, navigare la pagina principală
    }
  };

  // Funcția pentru apăsarea tastei Enter în bara de căutare
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchExams();
    }
  };

  return (
    <div className="course-page-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        {/* Logo-ul cu navigare la dashboard specific rolului */}
        <div
          className="menu-icon-container"
          onClick={() => router.push('/dashboardstudent')} // Navighează la dashboard
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <ul>
          {/* Calendar Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={navigateToCalendar} // Navighează la calendar specific rolului
              style={{ cursor: 'pointer' }}
            >
              <img src="/calendar.png" alt="Calendar" className="menu-icon" />
              <div className="menu-tooltip">Calendar</div>
            </div>
          </li>
        </ul>
      </div>

      {/* Main Content Section */}
      <div className="content">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Caută..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-button" onClick={fetchExams}>
            <img src="/search.png" alt="Search" className="search-icon" />
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="placeholder-content">
          {loading && <p>Se încarcă...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <ul>
            {data.items?.map((exam) => (
              <li key={exam.id}>
                <button className="card-button">{exam.name} - {exam.description}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExamFetcher;
