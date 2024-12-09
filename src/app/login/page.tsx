'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import './login.css';
import { login } from '@/app/services/loginService';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Funcție pentru a afișa/ascunde parola
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Funcție de gestionare a trimiterii formularului
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    // Validare câmpuri
    if (!email || !password) {
      setError('Toate câmpurile sunt obligatorii.');
      return;
    }

    try {
      const { user_type } = await login(email, password);

      // Setarea cookie-urilor pe baza rolului primit din backend
      document.cookie = 'isLoggedIn=true; path=/;';
      document.cookie = `userRole=${user_type}; path=/;`;

      // Redirecționare în funcție de rol
      if (user_type === 'student') {
        handleNavigation('/dashboardstudent');
      } else if (user_type === 'profesor') {
        handleNavigation('/dashboardteacher');
      } else {
        setError('Rol necunoscut. Contactați administratorul.');
      }
    } catch (err: any) {
      setError(err.message || 'Eroare la conectarea cu serverul.');
    }
  };

  // Verificare autentificare pe încărcarea paginii
  /*useEffect(() => {
    const checkAuthStatus = () => {
      const isLoggedIn = document.cookie.includes('isLoggedIn=true');
      const userRole = document.cookie.split('; ').find((row) => row.startsWith('userRole='));

      if (isLoggedIn && userRole) {
        const role = userRole.split('=')[1];
        if (role === 'student') {
          handleNavigation('/dashboardstudent'); // Navigare cu router.push
        } else if (role === 'profesor') {
          handleNavigation('/dashboardteacher'); // Navigare cu router.push
        }
      }
    };

    checkAuthStatus();
  }, [router]);*/

  // Gestionare schimbare în câmpurile de text
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login Now</h2>
        <form className="form-primary" onSubmit={handleSubmit}>
          <div className="text-box-form">
            {/* Input pentru email */}
            <div className="input-group">
              <img src="/user.png" alt="User Icon" className="icon" />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {/* Input pentru parola */}
            <div className="input-group">
              <img src="/padlock.png" alt="Padlock Icon" className="icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <img
                src={showPassword ? '/show.png' : '/hide.png'}
                alt="Eyes Icon"
                className="icon-eyes"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              />
            </div>
            {/* Mesaj de eroare */}
            {error && <p className="error-message">{error}</p>}
          </div>
          {/* Buton de conectare */}
          <div className="button-submit">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
      {/* Ilustrație pentru partea dreaptă */}
      <div className="illustration">
        <div className="illustration-logo">
        <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <div className="illustration-background">
          <div className="illustration-mini">
            <img src="/illustration.png" alt="Illustration" className="illustration-image" />
          </div>
        </div>
      </div>
    </div>
  );
}
