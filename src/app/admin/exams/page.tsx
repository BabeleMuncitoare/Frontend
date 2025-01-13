'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminExams } from '@/app/services/adminService';

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAdminExams();
        setExams(data);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Failed to fetch exams. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="exams-management">
      <h1 className='exam'>Exam Management</h1>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {exams.map((exam: { id: number; title: string; date: string }) => (
          <li key={exam.id}>
            {exam.title} - {exam.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
