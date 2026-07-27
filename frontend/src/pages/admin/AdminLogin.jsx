import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple mock authentication for frontend-only
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('dream_cream_admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <img src="/logo.png" alt="Logo" />
        <h1>Admin Portal</h1>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Username (admin)" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <input 
            type="password" 
            placeholder="Password (admin123)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <button 
            type="submit"
            style={{ 
              background: 'var(--color-primary)', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
