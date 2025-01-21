const API_URL = "https://bigbaba.yirade.dev/api/";
import {Class} from "@/app/services/interfaces";
function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export async function fetchClasses(): Promise<Class[]> {
  const token = getCookie('accessToken'); // Preia token-ul pentru autorizare
  console.log('Access Token din Cookie:', token);

  const response = await fetch(`${API_URL}classes/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Eroare la obținerea claselor.");
  }

  const data = await response.json();

  // Returnează toate câmpurile disponibile pentru clase
  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    students: c.students, // Asigură-te că acest câmp există în răspuns
    professors: c.professors, // Asigură-te că acest câmp există în răspuns
  }));
}

