'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';
import { login } from '@/app/services/loginService';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne comportamentul implicit al formularului
    setError(''); // Resetează eroarea anterioară
  
    const { username, password } = formData;
  
    if (!username || !password) {
      setError('Toate câmpurile sunt obligatorii.');
      return;
    }
  
    try {
      // Trimite cererea de autentificare la backend
      const response = await login(username, password);
  
      // Loghează răspunsul primit
      console.log('Răspunsul backend-ului:', response);
  
      // Extrage user_type din răspuns
      const { user } = response;
  
      if (!user || !user.user_type) {
        throw new Error('Răspunsul backend-ului este invalid.');
      }
  
      // Salvează rolul utilizatorului în cookies
      document.cookie = 'isLoggedIn=true; path=/;';
      document.cookie = `userRole=${user.user_type}; path=/;`;
  
      // Redirecționează în funcție de user_type
      if (user.user_type === 'student') {
        handleNavigation('/dashboardstudent');
      } else if (user.user_type === 'professor') {
        handleNavigation('/dashboardteacher');
      } else {
        setError('Rol necunoscut. Contactați administratorul.');
      }
    } catch (err: any) {
      // Loghează eroarea pentru debugging
      console.error('Eroare la autentificare:', err);
      setError(err.message || 'Eroare la conectarea cu serverul.');
    }
  };

  

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login Now</h2>
        <form className="form-primary" onSubmit={handleSubmit}>
          <div className="text-box-form">
            <div className="input-group">
              <img src="/user.png" alt="User Icon" className="icon" />
              <input
                type="text"
                name="username"
                placeholder="Email"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
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
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="button-submit">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
      <div className="illustration">
        <div className="illustration-logo">
          <img src="/logo.png" alt="USV Logo" className="logo" />
        </div>
        <div className="illustration-background">
          <img src="/illustration.png" alt="Illustration" className="illustration-image" />
        </div>
      </div>
    </div>
  );
}
