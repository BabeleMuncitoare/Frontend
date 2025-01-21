export interface Professor {
    id: number;
    user_name: string;
    department: string;
}

export interface Student {
    id: number;
    user_name: string;
    group: string;
    year_of_study: number;
}

export interface Class {
    id: number;
    name: string;
    professors: number[];
    students: number[];
}

export interface Exam {
    id: number;
    subject: string;
    date: string;
    location: string;
    accepted: boolean | null;
    rejected: boolean | null;
    class_assigned: number;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    user_type: string;
}

export interface ClassCreateData {
    name: string;
    professors: number[];
    students: number[];
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  }