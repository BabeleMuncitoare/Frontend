const API_URL = "https://bigbaba.yirade.dev/api/admin";

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
