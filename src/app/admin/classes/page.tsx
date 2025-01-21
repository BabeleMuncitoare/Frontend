'use client'
import React, { useEffect, useState } from 'react';
import { fetchProfessorsByIds, fetchAdminClasses } from '@/app/services/adminService';
import './class.css';

interface Professor {
  id: number;
  user_name: string;
  department: string;
}


interface Class {
  id: number;
  name: string;
  professors: number[]; // ID-uri de profesori
  students: number[]; // ID-uri de studenți
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Preluăm datele pentru clase
        const classData = await fetchAdminClasses();
        setClasses(classData);

        // Extragem ID-urile profesorilor
        const professorIds: unknown[] = classData.flatMap((cls: Class) => cls.professors);

        // Verificăm și transmitem array-ul de ID-uri validat
        const professorData = await fetchProfessorsByIds(professorIds);
        setProfessors(professorData);
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
                {cls.professors.map((professorId) => {
                  const professor = professors.find((p) => p.id === professorId);
                  return professor ? (
                    <li key={`professor-${professor.id}`}>
                      {professor.user_name}
                    </li>
                  ) : (
                    <li key={`professor-${professorId}`}>Loading...</li>
                  );
                })}
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
