'use client';

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "./calendarteacher.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { fetchUserExams, acceptExam, rejectExam } from "@/app/services/examsService";


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
        const acceptedExams = examsData.filter((exam: Exam) => !exam.rejected);
        setExams(acceptedExams);
        
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    loadExams();
  }, []);

   // Funcție pentru a accepta examenul
   const handleAcceptExam = async () => {
    if (selectedExam) {
      try {
        const response = await acceptExam(selectedExam.id, true);
        console.log("Exam accepted:", response);
        setExams((prevExams) =>
          prevExams.map((exam) =>
            exam.id === selectedExam.id ? { ...exam, accepted: true } : exam
          )
        );
        setShowModal(false); // Închidem modalul
      } catch (error) {
        console.error("Error accepting exam:", error);
      }
    }
  };

  // Funcție pentru a respinge examenul
  const handleRejectExam = async () => {
    if (selectedExam) {
      try {
        const response = await rejectExam(selectedExam.id, true); // Implementați funcția rejectExam în services
        console.log("Exam rejected:", response);
        setExams((prevExams) =>
          prevExams.map((exam) =>
            exam.id === selectedExam.id ? { ...exam, rejected: true } : exam
          )
        );
        setShowModal(false); // Închidem modalul
      } catch (error) {
        console.error("Error rejecting exam:", error);
      }
    }
  };

  const getStatusLabel = (exam: Exam) => {
    if (exam.accepted) {
      return "Acceptat";
    } else if (exam.rejected) {
      return "Respins";
    } else {
      return "În așteptare";
    }
  };

  const pendingExams = exams.filter((exam) => !exam.accepted && !exam.rejected);
  const acceptedExams = exams.filter((exam) => exam.accepted);
  
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
          <h2>Examene în așteptare</h2>
         {/* Examene în așteptare */}
         <div className="content-row">

          <div className="placeholder-content">
            {pendingExams.length > 0 ? (
              pendingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="card-button"
                  onClick={() => {
                    setSelectedExam(exam);
                    setShowModal(true);
                  }}
                >
                  <strong>{exam.subject}</strong>
                  <p>Data: {new Date(exam.date).toLocaleDateString()}</p>
                  <p>Locație: {exam.location}</p>
                  <p>Status: {getStatusLabel(exam)}</p>
                </div>
              ))
            ) : (
              <p>Nu există examene în așteptare momentan.</p>
            )}
          </div>
        </div>
<h2>Examene acceptate</h2>
        {/* Examene acceptate */}
        <div className="content-row">
          
          <div className="placeholder-content">
            {acceptedExams.length > 0 ? (
              acceptedExams.map((exam) => (
                <div key={exam.id} className="card-button">
                  <strong>{exam.subject}</strong>
                  <p>Data: {new Date(exam.date).toLocaleDateString()}</p>
                  <p>Locație: {exam.location}</p>
                  <p>Status: {getStatusLabel(exam)}</p>
                </div>
              ))
            ) : (
              <p>Nu există examene acceptate momentan.</p>
            )}
          </div>
        </div>

          {/* Modal Section */}
          {showModal && selectedExam && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Raspuns examen: {selectedExam.subject}</h2>
                <div className="modal-actions">
                  <Button onClick={handleAcceptExam}>Acceptare examen</Button>
                  <Button onClick={handleRejectExam}>Respingere examen</Button>
                </div>
                <div className="modal-actions">
                  <Button onClick={() => setShowModal(false)}>Anulează</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

  );
};

export default CalendarTeacherPage;
