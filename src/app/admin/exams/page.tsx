'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminExams, fetchAdminClasses, updateExam } from '@/app/services/adminService';
import './exams.css';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [editMode, setEditMode] = useState<'date' | 'location' | null>(null);
  const [formData, setFormData] = useState({ date: null as Date | null, time: '', location: '' });

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

  const handleDateSelect = (date: Date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditExam = (exam: Exam, mode: 'date' | 'location') => {
    setEditingExam(exam);
    setEditMode(mode);

    if (mode === 'date') {
      setFormData({ date: new Date(exam.date), time: exam.date.split('T')[1].substring(0, 5), location: '' });
    } else if (mode === 'location') {
      setFormData({ date: null, time: '', location: exam.location });
    }
  };

  const formatDateToDatabase = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSaveChanges = async () => {
    if (editingExam && editMode) {
      try {
        let updatedExam = { ...editingExam };
  
        if (editMode === 'date') {
          if (formData.date && formData.time) {
            updatedExam.date = `${formatDateToDatabase(formData.date)}T${formData.time}:00Z`;
          } else {
            alert('Both date and time are required.');
            return;
          }
        } else if (editMode === 'location') {
          updatedExam.location = formData.location;
        }
  
        // Trimite cererea către server
        const updatedExamFromServer = await updateExam(editingExam.id, updatedExam);
        console.log('Updated exam:', updatedExamFromServer);
  
        // Actualizează lista locală
        updateExamList(updatedExamFromServer);
  
        // Resetează stările
        setEditingExam(null);
        setEditMode(null);
      } catch (error) {
        console.error('Error updating exam:', error);
        alert('Failed to update exam. Please try again.');
      }
    }
  };
  

  const updateExamList = (updatedExam: Exam) => {
    setExams((prev) =>
      prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam))
    );
    setFilteredExams((prev) =>
      prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam))
    );
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

      {editingExam && (
        <div className="edit-exam-form">
          <h2>{editMode === 'date' ? 'Edit Date' : 'Edit Location'}</h2>
          {editMode === 'date' && (
            <>
              <div className="form-field">
                <label>Date:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="calendar-button">
                      {formData.date
                        ? formData.date.toLocaleDateString('ro-RO', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        })
                        : 'Select Date'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="calendar-popover-content">
                    <DayPicker
                      captionLayout="dropdown"
                      defaultMonth={new Date()}
                      mode="single"
                      selected={formData.date || undefined}
                      onSelect={(date) => handleDateSelect(date!)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="form-field">
                <label>Time:</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
          {editMode === 'location' && (
            <div className="form-field">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          )}
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={() => { setEditingExam(null); setEditMode(null); }}>Cancel</button>
        </div>
      )}

      <ul className="exam-list">
        {filteredExams.map((exam) => (
          <li
            key={exam.id}
            className={`exam-item ${exam.accepted
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
            <div className="exam-actions">
              <button onClick={() => handleEditExam(exam, 'date')}>Modify Date</button>
              <button onClick={() => handleEditExam(exam, 'location')}>Modify Location</button>
            </div>
          </li>
        ))}
      </ul>


    </div>
  );
}
