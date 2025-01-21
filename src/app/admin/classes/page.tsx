'use client';
import React, { useEffect, useState } from 'react';
import { deleteClass, createClass, fetchProfessorsByIds, fetchStudentsByIds, fetchAdminClasses, fetchAllProfessors } from '@/app/services/adminService';
import './class.css';
import { Student, Professor, Class, ClassCreateData } from '@/app/services/interfaces';

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState('');
  const [allProfessors, setAllProfessors] = useState<Professor[]>([]);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedProfessors, setSelectedProfessors] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Preluăm datele pentru clase și profesorii din backend
        const [classData, allProfessorsData] = await Promise.all([
          fetchAdminClasses(),
          fetchAllProfessors(), // Preluăm direct toți profesorii
        ]);

        setClasses(classData);
        setAllProfessors(allProfessorsData); // Setăm profesorii preluați din API

        const professorIds: number[] = classData.flatMap((cls: Class) => cls.professors);
        const studentIds: number[] = classData.flatMap((cls: Class) => cls.students);

        const [professorData, studentData] = await Promise.all([
          fetchProfessorsByIds(professorIds),
          fetchStudentsByIds(studentIds),
        ]);

        setProfessors(professorData);
        setStudents(studentData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const handleCreateClass = () => {
    setIsCreateClassModalOpen(true);
  };

  const handleSaveNewClass = async () => {
    const newClassData = {
      name: newClassName,
      professors: selectedProfessors,
      students: selectedStudents,
    };

    try {
      const savedClass = await createClass(newClassData); // Salvează clasa în baza de date

      setClasses((prev) => [...prev, savedClass]); // Actualizează lista de clase
      setNewClassName('');
      setSelectedProfessors([]);
      setSelectedStudents([]);
      setIsCreateClassModalOpen(false);
    } catch (err) {
      console.error('Failed to create class:', err);
      setError('Failed to create class. Please try again later.');
    }
  };

  const handleToggleProfessor = (id: number) => {
    setSelectedProfessors((prev) =>
      prev.includes(id) ? prev.filter((profId) => profId !== id) : [...prev, id]
    );
  };

  const handleToggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((studId) => studId !== id) : [...prev, id]
    );
  };
  const handleDeleteClass = async (classId: number) => {
    try {
      await deleteClass(classId); // Șterge clasa din baza de date
      setClasses((prev) => prev.filter((cls) => cls.id !== classId)); // Actualizează lista locală
    } catch (err) {
      console.error('Failed to delete class:', err);
      setError('Failed to delete class. Please try again later.');
    }
  };

  return (
    <div className="class-management">
      <h1 className="class">Class Management</h1>
      {error && <p className="error-message">{error}</p>}

      <button className="button-add" onClick={handleCreateClass}>Create Class</button>

      <ul>
        {classes.map((cls) => (
          <li key={cls.id} className="class-item">
            <div className="class-header">
              <h2>{cls.name}</h2>
              <button
                className="button-delete"
                onClick={() => handleDeleteClass(cls.id)}
              >
                Delete
              </button>
            </div>
            <div>
              <h3>Professors:</h3>
              <ul>
                {cls.professors.map((professorId) => (
                  <li key={`professor-${professorId}`}>
                    {professors.find((prof) => prof.id === professorId)?.user_name || 'Unknown Professor'}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Students:</h3>
              <ul>
                {cls.students.map((studentId) => (
                  <li key={`student-${studentId}`}>
                    {students.find((std) => std.id === studentId)?.user_name || 'Unknown Student'}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {isCreateClassModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setIsCreateClassModalOpen(false)}
            >
              ×
            </button>
            <h3>Create New Class</h3>
            <div>
              <label className='label-class'>Class Name:</label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
            </div>

            <div className="list-container">
              <div>
                <h4>Professors:</h4>
                <ul>
                  {allProfessors.map((prof) => (
                    <li key={prof.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedProfessors.includes(prof.id)}
                          onChange={() => handleToggleProfessor(prof.id)}
                        />
                        {prof.user_name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4>Students:</h4>
                <ul>
                  {students.map((std) => (
                    <li key={std.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(std.id)}
                          onChange={() => handleToggleStudent(std.id)}
                        />
                        {std.user_name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="button-add" onClick={handleSaveNewClass}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
