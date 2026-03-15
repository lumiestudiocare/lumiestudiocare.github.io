import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { Input, Button } from '../../components/ui';
import logoImg from '../../assets/logo.png';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate async
    const ok = login(username, password);
    setLoading(false);
    if (ok) navigate('/admin/dashboard');
    else setError('Credenciais inválidas. Tente novamente.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--brown)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* bg decoration */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: 400, height: 400, borderRadius: '50%',
        border: '1px solid rgba(215,166,41,.1)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: 300, height: 300, borderRadius: '50%',
        border: '1px solid rgba(215,166,41,.08)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'var(--white)', padding: '3rem 2.5rem',
        width: '100%', maxWidth: 420,
        boxShadow: 'var(--shadow-lg)',
        animation: 'fadeUp .6s ease both',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src={logoImg} alt="Lumiê" style={{ height: 80, objectFit: 'contain', marginBottom: '1rem' }} />
          <span style={{ fontSize: '.68rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--nude)', display: 'block' }}>
            Painel Administrativo
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <Input
            label="E-mail"
            type="email"
            placeholder="admin@lumie.com.br"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && (
            <p style={{ fontSize: '.8rem', color: '#ef4444', textAlign: 'center' }}>⚠ {error}</p>
          )}
          <Button type="submit" disabled={loading} style={{ marginTop: '.5rem', width: '100%', justifyContent: 'center' }}>
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.75rem', color: 'var(--nude)' }}>
          <a href="/" style={{ color: 'var(--nude)', textDecoration: 'none' }}>← Voltar ao site</a>
        </p>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.68rem', color: 'rgba(175,160,144,.6)', letterSpacing: '.1em' }}>
          demo: admin@lumie.com.br · lumie2025
        </p>
      </div>
    </div>
  );
};
