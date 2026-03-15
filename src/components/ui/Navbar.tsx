import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Serviços', to: '/#servicos' },
    { label: 'Sobre',    to: '/#sobre' },
    { label: 'Depoimentos', to: '/#depoimentos' },
    { label: 'Contato',  to: '/#contato' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 5%',
      height: scrolled ? '64px' : '80px',
      background: scrolled ? 'rgba(248,240,245,.92)' : 'rgba(248,240,245,.75)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(215,166,41,.12)',
      transition: 'height .3s ease, background .3s ease',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logoImg} alt="Lumiê" style={{ height: scrolled ? '46px' : '58px', width: 'auto', transition: 'height .3s ease', objectFit: 'contain' }} />
      </Link>

      {/* Desktop */}
      <ul style={{ display: 'flex', gap: '2.4rem', listStyle: 'none' }} className="nav-desktop">
        {links.map(l => (
          <li key={l.to}>
            <a href={l.to} style={{
              fontSize: '.75rem', letterSpacing: '.2em', textTransform: 'uppercase',
              color: 'var(--text-soft)', textDecoration: 'none', transition: 'color .25s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--brown)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
            >{l.label}</a>
          </li>
        ))}
      </ul>

      <Link to="/agendar" style={{
        fontSize: '.75rem', letterSpacing: '.2em', textTransform: 'uppercase',
        padding: '.6rem 1.6rem',
        border: '1px solid var(--gold)',
        color: 'var(--brown)',
        background: location.pathname === '/agendar' ? 'var(--gold)' : 'transparent',
        transition: 'background .3s, color .3s',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
        onMouseLeave={e => {
          if (location.pathname !== '/agendar') {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--brown)';
          }
        }}
      >
        Agendar
      </Link>

      <style>{`
        @media(max-width:768px){.nav-desktop{display:none!important}}
      `}</style>
    </nav>
  );
};
