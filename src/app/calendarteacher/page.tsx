'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import './calendarteacher.css';

const CalendarTeacherPage = () => {
  const router = useRouter();
  const [selectedDate, setDate] = useState<Date | undefined>(new Date());

  const handleScheduleExam = () => {
    if (selectedDate) {
      console.log('Scheduling exam on:', selectedDate);
      router.push(`/schedule-exam?date=${selectedDate.toISOString()}`);
    }
  };
  
  return (
    <div className="dashboard-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <div onClick={() => router.push('/dashboardteacher')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="content">
        <h1 className="calendar-title">Select a Date for Exam Scheduling</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="calendar-button">
              {selectedDate ? selectedDate.toLocaleDateString() : "Select a Date"}
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
            <p className="calendar-selected-date">
              Selected Date: {selectedDate.toLocaleDateString()}
            </p>
            <Button className="calendar-button" onClick={handleScheduleExam}>
              Schedule Exam
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarTeacherPage;
