'use client';

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "./calendarstudent.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface Course {
  name: string;
  professor: string;
  status: string;
  examDate: string | null;
}

const CalendarStudentPage = () => {
  const router = useRouter();
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(new Date());
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    professorName: "",
    date: undefined as Date | undefined,
    time: "",
    room: "",
  });

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleScheduleExam = () => {
    if (formData.date) {
      console.log("Scheduling exam on:", formData.date);
      router.push(`/schedule-exam?date=${formData.date.toISOString()}`);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/cursuri.json");
        const data = await response.json();
        setCourses(data.courses);

        // Extract exam dates for accepted courses
        const acceptedDates = data.courses
          .filter((course: Course) => course.status === "Acceptat" && course.examDate)
          .map((course: Course) => new Date(course.examDate!));
        setHighlightedDates(acceptedDates);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = () => {
    console.log("Scheduled exam:", formData);
    setShowModal(false);
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

        {/* Placeholder Content and Static Calendar */}
        <div className="content-row">
          <div className="placeholder-content">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div
                  key={index}
                  className={`card-button ${getStatusClass(course.status)}`}
                  onMouseEnter={() => {
                    if (course.examDate) {
                      setHoveredDate(new Date(course.examDate));
                    }
                  }}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <strong>{course.name}</strong>
                  <p>{course.professor}</p>
                </div>
              ))
            ) : (
              <p>Nu există cursuri disponibile momentan.</p>
            )}
          </div>

          <div className="static-calendar">
            <DayPicker
              defaultMonth={new Date(2025, 0)}
              mode="single"
              selected={calendarSelectedDate}
              onSelect={setCalendarSelectedDate}
              modifiers={{
                highlighted: highlightedDates,
                hovered: hoveredDate ? [hoveredDate] : [],
              }}
              modifiersStyles={{
                highlighted: { backgroundColor: "#4a3fd6", color: "white" },
                hovered: { border: "2px solid rgb(57, 190, 57)" },
              }}
              className="custom-calendar"
            />
          </div>
        </div>

        {/* Schedule Exam Button */}
        <div className="button-section">
          <Button
            className="schedule-exam-button"
            onClick={() => setShowModal(true)}
          >
            Programează examen
          </Button>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Programează examen</h2>
            <div className="form-field">
              <label>Denumire curs:</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label>Nume Profesor:</label>
              <input
                type="text"
                name="professorName"
                value={formData.professorName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label>Data:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="calendar-button">
                    {formData.date
                      ? capitalizeFirstLetter(
                        formData.date.toLocaleDateString("ro-RO", {
                            weekday: "long",
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })
                        )
                      : "Selectați Data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="calendar-popover-content">
                  <DayPicker
                    captionLayout="dropdown"
                    defaultMonth={new Date(2025, 0)}
                    mode="single"
                    selected={formData.date || undefined}
                    onSelect={(date) => handleDateSelect(date!)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="form-field">
              <label>Ora:</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label>Sala:</label>
              <select
                name="room"
                value={formData.room}
                onChange={handleInputChange}
              >
                <option value="">Selectați sala</option>
                <option value="Sala 1">Sala 1</option>
                <option value="Sala 2">Sala 2</option>
                <option value="Sala 3">Sala 3</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
            <div className="modal-actions">
              <Button onClick={handleSubmit}>Salvează</Button>
              <Button onClick={() => setShowModal(false)}>Anulează</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarStudentPage;
