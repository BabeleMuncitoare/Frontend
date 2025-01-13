'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './admin.css';

export default function Admin() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(`/admin/${path}`);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-menu">
        <button onClick={() => navigateTo('users')}>User Management</button>
        <button onClick={() => navigateTo('classes')}>Class Management</button>
        <button onClick={() => navigateTo('exams')}>Exam Management</button>
        <button onClick={() => navigateTo('announcements')}>Announcements</button>
      </div>
    </div>
  );
}
