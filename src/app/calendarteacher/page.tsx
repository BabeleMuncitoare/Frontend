'use client';

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "./calendarteacher.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { fetchUserExams, updateExamStatus } from "@/app/services/examsService";


interface Exam {
  id: number;
  subject: string;
  date: string;
  location: string;
  class_assigned: number;
  created_by: number;
  accepted: boolean;
  rejected: boolean;
}

const CalendarTeacherPage = () => {
  const router = useRouter();
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null); // State for the selected exam

  useEffect(() => {
    const loadExams = async () => {
      try {
        const examsData = await fetchUserExams();
        setExams(examsData);

      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    loadExams();
  }, []);

  const handleUpdateExamStatus = async (examId: number, accepted: boolean, rejected: boolean) => {
    try {
      const updatedExam = await updateExamStatus(examId, accepted, rejected);
      console.log('Exam status updated successfully:', updatedExam);
      // Actualizează starea examenelor după actualizare
      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam.id === examId ? { ...exam, accepted, rejected } : exam
        )
      );
      setShowModal(false); // Închide modalul după actualizare
    } catch (error) {
      console.error('Error updating exam status:', error);
    }
  };

  const handleButtonClick = (examId: number, accepted: boolean, rejected: boolean) => {
    return () => {
      handleUpdateExamStatus(examId, accepted, rejected);
    };
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div
          onClick={() => router.push("/dashboardteacher")}
          style={{ cursor: "pointer" }}
        >
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="calendar-page-content">
        <h1 className="calendar-page-header">Examene in asteptare</h1>

        {/* Placeholder Content and Static Calendar */}
        <div className="content-row">
          <div className="placeholder-content">
            {exams.length > 0 ? (
              exams.map((exam) => (
                <div key={exam.id} className='card-button'
                  onClick={() => {
                    setSelectedExam(exam);
                    setShowModal(true);
                  }}
                  onMouseEnter={() => {
                    if (exam.date) {
                      setHoveredDate(new Date(exam.date));
                    }
                  }}
                  onMouseLeave={() => setHoveredDate(null)}>
                  <strong>{exam.subject}</strong>
                  <p>Data: {new Date(exam.date).toLocaleDateString()}</p>
                  <p>Locație: {exam.location}</p>
                </div>
              ))
            ) : (
              <p>Nu există examene in asteptare momentan.</p>
            )}
          </div>
          {/* Modal Section */}
          {showModal && selectedExam && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Raspuns examen: {selectedExam.subject}</h2>
                <div className="modal-actions">
                  <Button onClick={handleButtonClick(selectedExam.id, true, false)}>Acceptare examen</Button>
                  <Button onClick={handleButtonClick(selectedExam.id, false, true)}>Respingere examen</Button>
                </div>
                <div className="modal-actions">
                  <Button onClick={() => setShowModal(false)}>Anulează</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarTeacherPage;
