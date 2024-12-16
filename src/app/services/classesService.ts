const API_URL = "http://127.0.0.1:8000/api/";

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export async function fetchClasses() {
    const token = getCookie('authToken');

  const response = await fetch(`${API_URL}/classes/`, {
    headers: { Authorization: `Bearer ${token}` }, // Adaugă token-ul JWT
  });
  
  if (!response.ok) {
    throw new Error("Eroare la obținerea claselor.");
  }

  const data = await response.json();

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
  }));
}
