'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminExams, fetchAdminClasses } from '@/app/services/adminService';
import './exams.css';

interface Exam {
  id: number;
  subject: string;
  date: string;
  location: string;
  accepted: boolean | null;
  rejected: boolean | null;
  class_assigned: number;
}

interface Class {
  id: number;
  name: string;
}

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examData, classData] = await Promise.all([
          fetchAdminExams(),
          fetchAdminClasses(),
        ]);

        setExams(examData);
        setFilteredExams(examData);
        setClasses(classData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterExams = () => {
      let filtered = exams;

      if (selectedClass) {
        const classId = classes.find((cls) => cls.name === selectedClass)?.id;
        if (classId) {
          filtered = filtered.filter((exam) => exam.class_assigned === classId);
        }
      }

      if (selectedStatus === 'accepted') {
        filtered = filtered.filter((exam) => exam.accepted === true);
      } else if (selectedStatus === 'rejected') {
        filtered = filtered.filter((exam) => exam.rejected === true);
      } else if (selectedStatus === 'pending') {
        filtered = filtered.filter((exam) => !exam.accepted && !exam.rejected);
      }

      setFilteredExams(filtered);
    };

    filterExams();
  }, [exams, selectedClass, selectedStatus, classes]);

  const getClassNameById = (id: number) => {
    return classes.find((cls) => cls.id === id)?.name || 'Unknown Class';
  };

  return (
    <div className="exams-management">
      <h1 className="exam-title">Exam Management</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="filters">
        <label>
          Filter by Class:
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Filter by Status:
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </label>
      </div>

      <ul className="exam-list">
        {filteredExams.map((exam) => (
          <li
            key={exam.id}
            className={`exam-item ${
              exam.accepted
                ? 'accepted'
                : exam.rejected
                ? 'rejected'
                : 'pending'
            }`}
          >
            <h3>{exam.subject}</h3>
            <p>
              <strong>Date:</strong> {new Date(exam.date).toLocaleString()}
            </p>
            <p>
              <strong>Location:</strong> {exam.location}
            </p>
            <p>
              <strong>Class Assigned:</strong> {getClassNameById(exam.class_assigned)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
