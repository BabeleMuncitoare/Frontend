import { get } from "http";
const API_URL = "https://bigbaba.yirade.dev/api";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift() || null;
      console.log(`Retrieved cookie: ${name} = ${cookieValue}`);
      return cookieValue;
  }
  return null;
}

export async function fetchUserExams() {
    const token = getCookie('accessToken');

  const response = await fetch(`${API_URL}/exams/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Eroare la obținerea examenelor.");
  return await response.json();
}



export async function scheduleExam(examData: any) {
    const token = getCookie('accessToken');

  const response = await fetch(`${API_URL}/exams/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(examData),
  });
  if (!response.ok) throw new Error("Eroare la programarea examenului....");
  return await response.json();
}

export async function acceptExam(examId: number, accepted: boolean) {
  const token = getCookie('accessToken');

  const response = await fetch(`${API_URL}/exams/${examId}/accept/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ "accepted":accepted }), // Trimitere parametru accepted
  });
  console.log("A fsfasfsa",response);
  if (!response.ok) {
    throw new Error(`${response.status}` || "Eroare la acceptarea examenului.");
  }
  console.log("Response ok!!!!",response);
  // Răspunsul dacă totul a fost în regulă
  return await response.json();
}

export async function rejectExam(examId: number, rejected: boolean) {
  const token = getCookie('accessToken');

  const response = await fetch(`${API_URL}/exams/${examId}/reject/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ "rejected":rejected }), // Trimitere parametru accepted
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Eroare la acceptarea examenului.");
  }

  // Răspunsul dacă totul a fost în regulă
  return await response.json();
}


{/*export async function updateExamStatus(examId: number, accepted: boolean, rejected: boolean) {
  const token = getCookie('accessToken');
  if (!token) {
    throw new Error("Token not found");
  }
  try {
    const payload = { accepted,rejected };
    console.log('Payload:', JSON.stringify(payload));
    const response = await fetch(`${API_URL}/exams/${examId}/${x}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const responseText = await response.text();
    console.log('Response text:', responseText);
    if (!response.ok) {
      console.error('Error response:', responseText);
      throw new Error(`Error updating exam status: ${response.status} ${response.statusText}`);
    }
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}*/}




