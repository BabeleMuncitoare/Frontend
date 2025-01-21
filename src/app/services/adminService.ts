const API_URL = "https://bigbaba.yirade.dev/api/admin";

import {Exam, Professor} from '@/app/services/interfaces';

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}

const token = getCookie('accessToken');

export async function fetchAdminUsers() {
    const response = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Eroare la obținerea utilizatorilor.");
    return await response.json();
}

export async function fetchAdminClasses() {
    const response = await fetch(`${API_URL}/classes/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Eroare la obținerea claselor.");
    return await response.json();
}

export async function fetchAdminExams() {
    const response = await fetch(`${API_URL}/exams/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Eroare la obținerea examenelor.");
    return await response.json();
}

export async function fetchAdminAnnouncements() {
    const response = await fetch(`${API_URL}/announcements/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Eroare la obținerea anunțurilor.");
    return await response.json();
}

export async function removeUserFromClass(classId: number, userId: number, userType: 'professor' | 'student') {
    const token = getCookie('accessToken');
    const endpoint = `${API_URL}/classes/${classId}/${userType}/${userId}/remove/`;

    const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error(`Failed to remove ${userType}`);
    }
}

export async function fetchUsersByIds(ids: number[]): Promise<{ id: number; username: string; email: string }[]> {
    const token = getCookie('accessToken');
    const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }), // Trimite lista de ID-uri
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user details.');
    }

    return await response.json();
}

export async function createAnnouncement(data: { title: string; content: string }) {
    const token = getCookie('accessToken');
    if (!token) {
        throw new Error('Access token is missing.');
    }

    console.log('Data sent:', data);
    console.log('Authorization Token:', token);

    const response = await fetch(`${API_URL}/announcements/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // Verifică tipul de răspuns primit
    console.log('Response status:', response.status);
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    // Dacă răspunsul este HTML, aruncă o eroare personalizată
    if (contentType?.includes('text/html')) {
        throw new Error('Received an HTML response. The API endpoint might be incorrect.');
    }

    // Încearcă să parsezi răspunsul JSON
    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create announcement');
    }

    return responseData;
}

export async function deleteAnnouncement(id: number) {
    const token = getCookie('accessToken');
    const response = await fetch(`${API_URL}/announcements/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete announcement');
}

export async function updateAnnouncement(data: { id: number; title: string; content: string }) {
    const token = getCookie('accessToken');
    const response = await fetch(`${API_URL}/announcements/${data.id}/`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update announcement');
    return await response.json();
}

export async function fetchProfessorsByIds(professorIds: unknown[]): Promise<any[]> {
    // Filtrăm pentru a ne asigura că toate ID-urile sunt de tipul number
    const validProfessorIds = professorIds.filter((id): id is number => typeof id === 'number');
  
    // Construim query-ul pentru ID-urile profesorilor
    const idsParam = validProfessorIds.join(','); // Formatează ID-urile într-un singur string de tipul "1,2,3"
  
    const token = getCookie('accessToken');
    const response = await fetch(`${API_URL}/professors/?ids=${idsParam}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response data:', errorData);
      throw new Error(errorData.error || 'Eroare la obținerea profesorilor.');
    }
  
    return await response.json();
  }

  export async function fetchStudentsByIds(studentIds: number[]): Promise<{ id: number; user_name: string; group: string; year_of_study: number }[]> {
    // Filtrăm pentru a ne asigura că toate ID-urile sunt de tipul number
    const validStudentIds = studentIds.filter((id): id is number => typeof id === 'number');
  
    // Construim query-ul pentru ID-urile studenților
    const idsParam = validStudentIds.join(','); // Formatează ID-urile într-un string de tipul "1,2,3"
  
    const token = getCookie('accessToken');
    const response = await fetch(`${API_URL}/students/?ids=${idsParam}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
  
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        throw new Error(errorData.error || 'Eroare la obținerea studenților.');
    }
  
    return await response.json();
}


export async function updateExam(id: number, updatedData: Partial<Exam>) {
    const token = getCookie('accessToken');
    const response = await fetch(`${API_URL}/exams/${id}/`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        throw new Error('Failed to update exam.');
    }

    return await response.json();
}

export async function fetchAllProfessors(): Promise<Professor[]> {
    const token = getCookie('accessToken');
    const response = await fetch(`${API_URL}/professors/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch professors from backend.');
    }

    return await response.json();
}

export async function createClass(data: { name: string; professors: number[]; students: number[] }) {
    const token = getCookie('accessToken'); // Asigură-te că ai funcția `getCookie` implementată
  
    const response = await fetch(`${API_URL}/classes/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create class.');
    }
  
    return await response.json();
  }

  export async function deleteClass(classId: number): Promise<void> {
    const token = getCookie('accessToken');
  
    const response = await fetch(`${API_URL}/classes/${classId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete class.');
    }
  }
  