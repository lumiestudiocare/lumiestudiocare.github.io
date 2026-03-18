import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

const NAV_LINKS = [
  { label: 'Serviços',     to: '/#servicos',   anchor: true },
  { label: 'Sobre',        to: '/#sobre',       anchor: true },
  { label: 'Depoimentos',  to: '/depoimentos',  anchor: false },
  { label: 'Contato',      to: '/contato',      anchor: false },
  { label: 'Minha Conta',  to: '/minha-conta',  anchor: false },
];

export const Navbar: React.FC = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (active = false): React.CSSProperties => ({
    fontSize: '.75rem', letterSpacing: '.2em', textTransform: 'uppercase',
    color: active ? 'var(--brown)' : 'var(--text-soft)',
    textDecoration: 'none', transition: 'color .25s',
    borderBottom: active ? '1px solid var(--gold)' : '1px solid transparent',
    paddingBottom: '2px',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%',
        height: scrolled ? '64px' : '80px',
        background: scrolled ? 'rgba(248,240,245,.96)' : 'rgba(248,240,245,.88)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(215,166,41,.12)',
        transition: 'height .3s ease, background .3s ease',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', zIndex: 201 }}>
          <img src={logoImg} alt="Lumiê" style={{ height: scrolled ? '46px' : '58px', width: 'auto', transition: 'height .3s ease', objectFit: 'contain' }} />
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: '2.4rem', listStyle: 'none', alignItems: 'center' }} className="nav-desktop">
          {NAV_LINKS.map(l => (
            <li key={l.to}>
              {l.anchor
                ? <a href={l.to} style={linkStyle()}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--brown)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
                  >{l.label}</a>
                : <Link to={l.to} style={linkStyle(isActive(l.to))}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--brown)')}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive(l.to) ? 'var(--brown)' : 'var(--text-soft)')}
                  >{l.label}</Link>
              }
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link to="/agendar" className="nav-cta-desktop" style={{
          fontSize: '.75rem', letterSpacing: '.2em', textTransform: 'uppercase',
          padding: '.6rem 1.6rem',
          border: '1px solid var(--gold)',
          color: isActive('/agendar') ? 'white' : 'var(--brown)',
          background: isActive('/agendar') ? 'var(--gold)' : 'transparent',
          transition: 'background .3s, color .3s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
          onMouseLeave={e => {
            if (!isActive('/agendar')) {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--brown)';
            }
          }}
        >Agendar</Link>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          style={{
            display: 'none', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', gap: '5px',
            width: 40, height: 40, background: 'transparent', border: 'none',
            cursor: 'pointer', zIndex: 201, padding: '6px',
          }}
        >
          <span style={{
            display: 'block', width: 24, height: 2, background: 'var(--brown)',
            transition: 'transform .3s, opacity .3s',
            transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block', width: 24, height: 2, background: 'var(--brown)',
            transition: 'opacity .3s',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: 24, height: 2, background: 'var(--brown)',
            transition: 'transform .3s, opacity .3s',
            transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="nav-overlay"
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 198,
          background: 'rgba(58,46,30,.45)',
          backdropFilter: 'blur(3px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity .3s ease',
        }}
      />

      {/* Mobile drawer */}
      <div
        className="nav-drawer"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(300px, 85vw)',
          zIndex: 199,
          background: 'var(--white)',
          boxShadow: '-8px 0 40px rgba(58,46,30,.18)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .35s cubic-bezier(.19,1,.22,1)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '90px',
          overflowY: 'auto',
        }}
      >
        {/* Logo inside drawer */}
        <div style={{ padding: '0 1.8rem 1.5rem', borderBottom: '1px solid var(--blush-dark)' }}>
          <img src={logoImg} alt="Lumiê" style={{ height: 52, objectFit: 'contain' }} />
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {NAV_LINKS.map(l => (
            l.anchor
              ? <a key={l.to} href={l.to} onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block', padding: '.95rem 1.8rem',
                    fontSize: '.82rem', letterSpacing: '.18em', textTransform: 'uppercase',
                    color: 'var(--text-soft)', textDecoration: 'none',
                    borderBottom: '1px solid var(--blush)',
                    transition: 'color .2s, background .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--brown)'; e.currentTarget.style.background = 'var(--blush)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-soft)'; e.currentTarget.style.background = 'transparent'; }}
                >{l.label}</a>
              : <Link key={l.to} to={l.to}
                  style={{
                    display: 'block', padding: '.95rem 1.8rem',
                    fontSize: '.82rem', letterSpacing: '.18em', textTransform: 'uppercase',
                    color: isActive(l.to) ? 'var(--brown)' : 'var(--text-soft)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--blush)',
                    borderLeft: isActive(l.to) ? '3px solid var(--gold)' : '3px solid transparent',
                    background: isActive(l.to) ? 'rgba(215,166,41,.05)' : 'transparent',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--brown)'; (e.currentTarget as HTMLElement).style.background = 'var(--blush)'; }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = isActive(l.to) ? 'var(--brown)' : 'var(--text-soft)';
                    (e.currentTarget as HTMLElement).style.background = isActive(l.to) ? 'rgba(215,166,41,.05)' : 'transparent';
                  }}
                >{l.label}</Link>
          ))}
        </nav>

        {/* CTA inside drawer */}
        <div style={{ padding: '1.5rem 1.8rem', borderTop: '1px solid var(--blush-dark)' }}>
          <Link to="/agendar" onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', textAlign: 'center',
              padding: '.9rem 1.5rem', background: 'var(--gold)', color: 'white',
              fontSize: '.82rem', letterSpacing: '.2em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'background .25s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--gold-dark)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--gold)')}
          >
            🦋 Agendar agora
          </Link>
          <p style={{ textAlign: 'center', marginTop: '.9rem', fontSize: '.7rem', color: 'var(--nude)', letterSpacing: '.1em' }}>
            (11) 99529-7274
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop       { display: none !important; }
          .nav-cta-desktop   { display: none !important; }
          .nav-hamburger     { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-drawer        { display: none !important; }
          .nav-overlay       { display: none !important; }
        }
      `}</style>
    </>
  );
};
