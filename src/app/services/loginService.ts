const API_URL = 'http://127.0.0.1:8000/api/login/';

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'A apărut o eroare.');
  }

  // Returnează răspunsul JSON complet
  return await response.json();
}