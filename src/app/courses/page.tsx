'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import './courses.css';

function ExamFetcher() {
  const router = useRouter();
  const [data, setData] = useState([]); // Starea pentru date
  const [loading, setLoading] = useState(false); // Indicatorul de încărcare
  const [error, setError] = useState(null); // Starea pentru erori
  const [searchTerm, setSearchTerm] = useState(""); // Termenul de căutare

  // Funcție pentru preluarea examenelor din API
  const fetchExams = async () => {
    setLoading(true); // Activează indicatorul de încărcare
    setError(null); // Resetează eroarea

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/examen/?query=${searchTerm}`);
      console.log("Răspuns API:", response.data); // Loghează răspunsul API
      setData(response.data); // Stochează datele în stare
    } catch (err) {
      setError("Eroare la încărcarea datelor!"); // Setează eroarea
      console.error("Eroare:", err);
    } finally {
      setLoading(false); // Dezactivează indicatorul de încărcare
    }
  };

  useEffect(() => {
    fetchExams(); // Apelează funcția fetchExams la montare
  }, []);

  // Funcție pentru navigarea la pagina specifică rolului utilizatorului
  const navigateToDashboard = () => {
    const userRole = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userRole='))
      ?.split('=')[1]; // Extrage valoarea rolului din cookie-uri

    if (userRole === 'student') {
      router.push('/dashboardstudent'); // Navighează la dashboard-ul studentului
    } else if (userRole === 'professor') {
      router.push('/dashboardteacher'); // Navighează la dashboard-ul profesorului
    } else {
      router.push('/'); // Dacă rolul este necunoscut, navighează la pagina principală
    }
  };

  // Funcția pentru apăsarea tastei Enter în bara de căutare
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchExams(); // Reia cererea cu termenul de căutare
    }
  };

  return (
    <div className="course-page-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        {/* Logo-ul cu navigare la dashboard specific rolului */}
        <div
          className="menu-icon-container"
          onClick={navigateToDashboard} // Apelează funcția pentru navigarea la dashboard
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <ul>
          {/* Calendar Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={() => router.push('/calendar')} // Navigare la calendar
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
            onChange={(e) => setSearchTerm(e.target.value)} // Actualizează termenul de căutare
            onKeyDown={handleKeyDown} // Ascultă evenimentul Enter
          />
          <button className="search-button" onClick={fetchExams}>
            <img src="/search.png" alt="Search" className="search-icon" />
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="placeholder-content">
          {loading && <p>Se încarcă...</p>} {/* Mesaj de încărcare */}
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Mesaj de eroare */}
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
