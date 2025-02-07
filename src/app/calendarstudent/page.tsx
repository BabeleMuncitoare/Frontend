'use client';

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "./calendarstudent.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { fetchUserExams, scheduleExam } from "@/app/services/examsService";
import { fetchClasses } from "@/app/services/classesService";
import { Exam} from "@/app/services/interfaces";

const CalendarStudentPage = () => {
  const router = useRouter();
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | undefined>(new Date());
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    date: undefined as Date | undefined,
    time: "",
    location: "",
    class_assigned: "",
  });

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatDateToDatabase = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Luna este indexată de la 0
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleScheduleExam = () => {
    if (formData.date) {
      console.log("Scheduling exam on:", formData.date);
      router.push(`/schedule-exam?date=${formData.date.toISOString()}`);
    }
  };


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
    // Setăm ID-ul studentului din cookie
    const id = getCookie("studentId");
    if (id) {
      setStudentId(id);
    } else {
      console.error("Student ID not found in cookies");
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;

    // Încărcăm datele examenelor și ale claselor
    const loadExamsAndClasses = async () => {
      try {
        // Obținem datele examenelor și ale claselor
        const examsData = await fetchUserExams();
        const classesData = await fetchClasses();

        console.log('Exams Data:', examsData); // Verifică datele examenelor
        console.log('Classes Data:', classesData); // Verifică datele claselor

        // Găsim grupa studentului pe baza ID-ului studentului
        const studentClass = classesData.find((cls) =>
          cls.students.includes(Number(studentId)) // Verificăm dacă studentul face parte din această clasă
        );

        // Dacă studentul face parte dintr-o grupă validă, filtrăm examenele
        if (studentClass) {
          const studentExams = examsData.filter(
            (exam: Exam) => exam.class_assigned === studentClass.id
          );
          setExams(studentExams);

          // Setăm datele examenelor pentru a le evidenția pe calendar
          const dates = studentExams.map((exam:Exam) => new Date(exam.date));
          setHighlightedDates(dates);
        } else {
          console.warn("Studentul nu face parte din nicio grupă validă.");
        }

        setClasses(classesData); // Setăm datele claselor
      } catch (error) {
        console.error("Error fetching exams or classes:", error);
      }
    };

    loadExamsAndClasses();
  }, [studentId]); // Refacem încărcarea datelor dacă `studentId` se schimbă
  
  
  const isDateHighlighted = (date: Date): boolean => {
    return highlightedDates.some(
      (highlightedDate) =>
        highlightedDate.toDateString() === date.toDateString()
    );
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
    console.log("Data selectată:", date);
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async () => {
    if (formData.subject && formData.date && formData.time && formData.location && formData.class_assigned) {
      try {
        const formattedDate = formatDateToDatabase(formData.date);

        const combinedDateTime = `${formattedDate}T${formData.time}:00Z`;

        await scheduleExam({
          subject: formData.subject,
          date: combinedDateTime,
          location: formData.location,
          class_assigned: parseInt(formData.class_assigned),
        });

        setShowModal(false);
        alert("Examenul a fost programat!");
      } catch (error) {
        console.error("Error scheduling exam:", error);
        alert("Eroare la programarea examenului.");
      }
    } else {
      alert("Toate câmpurile sunt obligatorii.");
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

        {/* Placeholder Content and Static Calendar */}
        <div className="content-row">
          <div className="placeholder-content">
            {exams.filter(exam => !exam.rejected).length > 0 ? (
              exams.filter(exam => !exam.rejected).map((exam, index) => (
                <div
                  key={index}
                  className={`card-button ${exam.accepted ? 'status-accepted' : exam.rejected ? 'status-rejected' : 'status-pending'}`}
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
              <p>Nu există examene disponibile momentan.</p>
            )}
          </div>

          <div className="static-calendar">
            <DayPicker
              defaultMonth={new Date(new Date().getFullYear(), 0)}
              mode="single"
              selected={calendarSelectedDate && isDateHighlighted(calendarSelectedDate) ? calendarSelectedDate : undefined}
              onSelect={(date) => {
                if (date && isDateHighlighted(date)) {
                  setCalendarSelectedDate(date);
                }
              }}              
              modifiers={{
                highlighted: highlightedDates,
                hovered: hoveredDate ? [hoveredDate] : [],
              }}
              modifiersStyles={{
                highlighted: { backgroundColor: "#4a3fd6", color: "white" },
                hovered: { border: "4px solid rgb(13, 10, 94)" },
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
              <label>Materie:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label>Grupa:</label>
              <select
                name="class_assigned"
                value={formData.class_assigned}
                onChange={handleInputChange}
              >
                <option value="">Selectați grupa</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
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
                    defaultMonth={new Date(new Date().getFullYear(), 0)}
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
              <label>Locație:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
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
