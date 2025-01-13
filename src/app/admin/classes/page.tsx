'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminClasses } from '@/app/services/adminService';
import './class.css';

interface Class {
  id: number;
  name: string;
  professors: number[]; // ID-uri de profesori
  students: number[]; // ID-uri de studenți
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAdminClasses();
        setClasses(data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to fetch classes. Please try again later.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="class-management">
      <h1 className="class">Class Management</h1>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {classes.map((cls) => (
          <li key={cls.id}>
            <h2>{cls.name}</h2>
            <div>
              <h3>Professors:</h3>
              <ul>
                {cls.professors.map((professorId) => (
                  <li key={`professor-${professorId}`}>Professor ID: {professorId}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Students:</h3>
              <ul>
                {cls.students.map((studentId) => (
                  <li key={`student-${studentId}`}>Student ID: {studentId}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
