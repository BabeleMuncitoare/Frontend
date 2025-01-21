'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminUsers } from '@/app/services/adminService';
import './user.css';
import {User} from '@/app/services/interfaces';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]); // Lista completă de utilizatori
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Lista utilizatorilor filtrați
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all'); // Filtrul curent: "all", "student", "professor", "admin"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAdminUsers();
        setUsers(data);
        setFilteredUsers(data); // Inițial, afișăm toți utilizatorii
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Funcție pentru a actualiza utilizatorii filtrați
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === 'all') {
      setFilteredUsers(users); // Afișează toți utilizatorii
    } else {
      // Filtrare pe baza tipului de utilizator
      const filtered = users.filter((user) => user.user_type === selectedFilter);
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="user-management">
      <h1 className="user">User Management</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Filtrul */}
      <div className="filter-container">
        <label htmlFor="user-filter">Filter by Role: </label>
        <select
          id="user-filter"
          value={filter}
          onChange={handleFilterChange}
          className="filter-dropdown"
        >
          <option value="all">All</option>
          <option value="student">Students</option>
          <option value="professor">Professors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Lista utilizatorilor */}
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} className={`user-item user-${user.user_type}`}>
            {user.username} ({user.email}) - {user.user_type}
          </li>
        ))}
      </ul>
    </div>
  );
}