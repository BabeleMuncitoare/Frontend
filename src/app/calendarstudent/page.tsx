'use client';

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/navigation";
import { fetchUserExams } from "@/app/services/examsService";
import { fetchClasses } from "@/app/services/classesService";
import { Exam, Class } from "@/app/services/interfaces";
import "./calendarstudent.css";
import "react-day-picker/dist/style.css";

const CalendarStudentPage = () => {
  const router = useRouter();
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(new Date());
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState("");

  const getCookie = (name: string): string | null => {
    // Preia toate cookie-urile
    const cookies = document.cookie;
    console.log("Document Cookies:", cookies); // Debugging - afișează toate cookie-urile
  
    // Construiește expresia regulată pentru a căuta numele cookie-ului
    const match = cookies.match(new RegExp(`(^|;)\\s*${name}=([^;]*)`));
    
    // Dacă găsește cookie-ul, îl returnează decodat
    if (match) {
      const value = decodeURIComponent(match[2]);
      console.log(`Cookie Found - ${name}:`, value); // Debugging - afișează valoarea cookie-ului găsit
      return value;
    }
  
    // Dacă nu găsește cookie-ul, returnează null
    console.warn(`Cookie Not Found - ${name}`); // Debugging - avertizează dacă nu găsește cookie-ul
    return null;
  };

  useEffect(() => {
    const loadExamsForStudent = async () => {
      try {
        const studentId = getCookie("student_id");
        console.log("Student ID from Cookie:", studentId); // Debugging
        if (!studentId) {
          setError("Nu există un ID de student disponibil.");
          return;
        }

        // Fetch classes and filter those containing the student
        const allClasses = await fetchClasses();
        console.log("All Classes Fetched:", allClasses); // Debugging

        const studentClass = allClasses.find((cls) =>
          cls.students?.includes(Number(studentId))
        );

        if (!studentClass) {
          setError("Nu s-au găsit clase pentru acest student.");
          console.log("No matching class found for Student ID:", studentId); // Debugging
          return;
        }

        console.log("Student Class Found:", studentClass.id); // Debugging

        // Fetch exams and filter by the class_assigned
        const allExams = await fetchUserExams();
        console.log("All Exams Fetched:", allExams); // Debugging

        const filteredExams = allExams.filter(
          (exam: Exam) => exam.class_assigned === studentClass.id && !exam.rejected
        );

        console.log("Filtered Exams for Class ID:", studentClass.id, filteredExams); // Debugging

        setExams(filteredExams);

        const dates = filteredExams.map((exam: Exam) => new Date(exam.date));
        setHighlightedDates(dates);
      } catch (error) {
        console.error("Eroare la încărcarea examenelor:", error);
        setError("A apărut o eroare la încărcarea examenelor.");
      }
    };

    loadExamsForStudent();
  }, []);

  const isDateHighlighted = (date: Date): boolean => {
    return highlightedDates.some(
      (highlightedDate) => highlightedDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div onClick={() => router.push("/dashboardstudent")} style={{ cursor: "pointer" }}>
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
      </div>

      <div className="calendar-page-content">
        <h1 className="calendar-page-header">Programare examene</h1>
        <div className="content-row">
          <div className="placeholder-content">
            {exams.length > 0 ? (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className={`card-button ${exam.accepted ? "status-accepted" : "status-pending"}`}
                  onMouseEnter={() => setHoveredDate(new Date(exam.date))}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <strong>{exam.subject}</strong>
                  <p>Data: {new Date(exam.date).toLocaleDateString()}</p>
                  <p>Locație: {exam.location}</p>
                </div>
              ))
            ) : (
              <p>Nu există examene disponibile momentan.</p>
            )}
          </div>
          <div className="static-calendar">
            <DayPicker
              mode="single"
              selected={
                calendarSelectedDate && isDateHighlighted(calendarSelectedDate)
                  ? calendarSelectedDate
                  : undefined
              }
              onSelect={(date) => setCalendarSelectedDate(date || undefined)}
              modifiers={{
                highlighted: highlightedDates,
              }}
              modifiersStyles={{
                highlighted: { backgroundColor: "#4a3fd6", color: "white" },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarStudentPage;
