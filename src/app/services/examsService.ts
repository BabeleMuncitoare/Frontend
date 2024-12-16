const API_URL = "http://127.0.0.1:8000/api";

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export async function fetchUserExams() {
    const token = getCookie('authToken');

  const response = await fetch(`${API_URL}/student/exams/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Eroare la obținerea examenelor.");
  return await response.json();
}

export async function scheduleExam(examData: any) {
    const token = getCookie('authToken');

  const response = await fetch(`${API_URL}/exams/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(examData),
  });
  if (!response.ok) throw new Error("Eroare la programarea examenului.");
  return await response.json();
}
