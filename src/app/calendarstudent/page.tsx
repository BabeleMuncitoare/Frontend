'use client';

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "./calendarstudent.css";

interface Course {
  name: string;
  professor: string;
  status: string; // Adăugăm status
}

const CalendarTeacherPage = () => {
  const router = useRouter();
  const [selectedDate, setDate] = useState<Date | undefined>(new Date());
  const [courses, setCourses] = useState<Course[]>([]);

  const handleScheduleExam = () => {
    if (selectedDate) {
      console.log("Scheduling exam on:", selectedDate);
      router.push(`/schedule-exam?date=${selectedDate.toISOString()}`);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/cursuri.json");
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Funcție pentru a genera clasa CSS pe baza statusului
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "acceptat":
        return "status-accepted";
      case "respins":
        return "status-rejected";
      case "asteptare":
        return "status-pending";
      default:
        return "";
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div
          onClick={() => router.push("/dashboardstudent")}
          style={{ cursor: "pointer" }}
        >
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="calendar-page-content">
        <h1 className="calendar-page-header">Programare examene</h1>
        {/* Placeholder Content */}
        <div className="placeholder-content">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <div
                key={index}
                className={`card-button ${getStatusClass(course.status)}`}
              >
                <strong>{course.name}</strong>
                <p>{course.professor}</p>
              </div>
            ))
          ) : (
            <p>Nu există cursuri disponibile momentan.</p>
          )}
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          <h1 className="calendar-title">Examene programate</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="calendar-button">
                {selectedDate
                  ? selectedDate.toLocaleDateString("ro-RO", {
                      weekday: "long",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })
                  : "Select a Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="calendar-popover-content">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => setDate(date)}
              />
            </PopoverContent>
          </Popover>
          {selectedDate && (
            <div className="calendar-actions">
              <Button className="calendar-button" onClick={handleScheduleExam}>
                Programează
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarTeacherPage;
