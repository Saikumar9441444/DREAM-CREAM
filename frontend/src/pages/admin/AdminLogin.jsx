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
    <div className="admin-login-page fade-in" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'url(/hero_bg.jpg) center/cover no-repeat',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}></div>
      
      <div className="admin-panel" style={{ 
        position: 'relative',
        zIndex: 10,
        maxWidth: '450px', 
        width: '90%', 
        padding: '3rem 2rem', 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.85)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ background: 'var(--color-primary)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(255, 123, 156, 0.3)' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '40px', filter: 'brightness(0) invert(1)' }} />
        </div>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Portal</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Sign in to manage your ice cream empire.</p>
        
        {error && <div style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Username</label>
            <input 
              type="text" 
              placeholder="Enter username (admin)" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'rgba(255,255,255,0.9)', outline: 'none', transition: 'border 0.2s', fontSize: '1rem' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#475569' }}>Password</label>
            <input 
              type="password" 
              placeholder="Enter password (admin123)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'rgba(255,255,255,0.9)', outline: 'none', transition: 'border 0.2s', fontSize: '1rem' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
          <button 
            type="submit"
            className="btn-primary"
            style={{ 
              width: '100%',
              padding: '1rem', 
              fontSize: '1.1rem',
              marginTop: '1rem',
              boxShadow: '0 10px 20px rgba(255, 123, 156, 0.4)'
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
