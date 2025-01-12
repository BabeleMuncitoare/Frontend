import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value; // Obține valoarea token-ului
  const userType = req.cookies.get('userType')?.value; // Obține rolul utilizatorului

  const url = req.nextUrl.clone();

  // Protejăm accesul la dashboard-ul studentului
  if (req.nextUrl.pathname.startsWith('/dashboardstudent')) {
    if (!accessToken || userType !== 'student') {
      url.pathname = '/'; // Redirecționează la pagina principală
      return NextResponse.redirect(url);
    }
  }

  // Protejăm accesul la dashboard-ul profesorului
  if (req.nextUrl.pathname.startsWith('/dashboardteacher')) {
    if (!accessToken || userType !== 'professor') {
      url.pathname = '/'; // Redirecționează la pagina principală
      return NextResponse.redirect(url);
    }
  }

  // Redirecționează utilizatorii autentificați departe de pagina de login
  if (req.nextUrl.pathname === '/') {
    if (accessToken && userType === 'student') {
      url.pathname = '/dashboardstudent'; // Redirecționează la dashboard-ul studentului
      return NextResponse.redirect(url);
    } else if (accessToken && userType === 'professor') {
      url.pathname = '/dashboardteacher'; // Redirecționează la dashboard-ul profesorului
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
