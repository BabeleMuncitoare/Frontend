'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'; // Importă useRouter
import './courses.css';



function ExamFetcher(){

  const router = useRouter(); // Inițializează router-ul
  const [data, setData] = useState([]); // Initial state is null
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(""); // Termenul de căutare

  const fetchExams = async () => {
  setLoading(false); // Pornește indicatorul de încărcare
  setError(null); // Resetează eroarea

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/examen/?query=${searchTerm}`); // Endpoint corect
    console.log("Raspuns APIII", response.data);  // Verifică ce răspuns primești de la API
    console.log("Search term sent to backend:", searchTerm);
    setData(response.data); // Stochează datele
  } catch (err) {
    setError("Eroare la încărcarea datelor!"); // Setează mesajul de eroare
    console.error("Eroare:", err);
  } finally {
    setLoading(false); // Dezactivează indicatorul de încărcare
  }
  
};

useEffect(() => {
  fetchExams(); // Apelează funcția de fetch când componenta este montată
}, []); // Lista goală ca dependență înseamnă că efectul va fi apelat doar o singură dată când pagina se încarcă

  // Funcția care se apelează la apăsarea tastelor
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchExams(searchTerm); // Apelează funcția de fetch cu termenul de căutare când se apasă Enter
    }
  };

  return (
    <div className="course-page-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        {/* Logo-ul cu navigare la dashboard */}
        <div
          className="menu-icon-container"
          onClick={() => router.push('/dashboardstudent')} // Navigare cu router.push
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <ul>
          {/* Calendar Button */}
          <li>
            <div
              className="menu-icon-container"
              onClick={() => router.push('/calendar')} // Navigare cu router.push
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
            value={searchTerm} // Asociază valoarea inputului cu starea
            onChange={(e) => setSearchTerm(e.target.value)} // Actualizează termenul de căutare
            onKeyDown={handleKeyDown}
          />
          <button className="search-button" onClick={fetchExams}>
            <img src="/search.png" alt="Search" className="search-icon" />
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="placeholder-content" >
          <div> 
            {loading && <p>Se încarcă...</p>} {/* Mesaj de încărcare */}
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Mesaj de eroare */}
          </div>
          <div>
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
    </div>
  );
};

export default ExamFetcher;
