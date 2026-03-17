import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faCalendarCheck, faScissors, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';

export const FixedFooter: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Don't show on booking page (already has CTA)
  if (location.pathname === '/agendar') return null;

  return (
    <>
      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a
        href="https://wa.me/5511995297274"
        target="_blank" rel="noreferrer"
        title="Falar no WhatsApp"
        style={{
          position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 200,
          width: 52, height: 52, borderRadius: '50%',
          background: '#25D366', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', boxShadow: '0 4px 20px rgba(37,211,102,.4)',
          transition: 'transform .25s, box-shadow .25s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.7)',
          pointerEvents: visible ? 'auto' : 'none',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(37,211,102,.5)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(37,211,102,.4)'; }}
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>

      {/* ── FIXED BOTTOM BAR ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 190,
        background: 'rgba(58,46,30,.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(215,166,41,.2)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .35s cubic-bezier(.19,1,.22,1)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '.7rem 5%', gap: '1rem', flexWrap: 'wrap',
        }}>

          {/* Left — info */}
          <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/5511995297274" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'rgba(248,240,245,.65)', fontSize: '.78rem', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#25D366')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,240,245,.65)')}
            >
              <FontAwesomeIcon icon={faWhatsapp} style={{ color: '#25D366' }} />
              (11) 99529-7274
            </a>

            <a href="https://maps.google.com/?q=R.+Areado,+11+Carapicuiba+SP" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: 'rgba(248,240,245,.65)', fontSize: '.78rem', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,240,245,.65)')}
            >
              <FontAwesomeIcon icon={faLocationDot} style={{ color: 'var(--gold)' }} />
              R. Areado, 11 — Carapicuíba
            </a>

            {/* Quick links — desktop only */}
            <div style={{ display: 'flex', gap: '1.2rem' }} className="footer-links">
              {[
                { icon: faScissors,  label: 'Serviços', to: '/#servicos' },
                { icon: faEnvelope,  label: 'Contato',  to: '/contato' },
              ].map(l => (
                <a key={l.to} href={l.to}
                  style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: 'rgba(248,240,245,.5)', fontSize: '.75rem', letterSpacing: '.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,240,245,.5)')}
                >
                  <FontAwesomeIcon icon={l.icon} style={{ fontSize: '.75rem' }} />
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — social + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="https://instagram.com/lumiestudio" target="_blank" rel="noreferrer"
              style={{ color: 'rgba(248,240,245,.5)', fontSize: '1.1rem', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E1306C')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,240,245,.5)')}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>

            <Link to="/agendar" style={{
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
              padding: '.55rem 1.4rem', background: 'var(--gold)', color: 'white',
              fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase',
              transition: 'background .25s, transform .2s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold-dark)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              Agendar agora
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:640px){ .footer-links { display: none !important; } }
      `}</style>
    </>
  );
};
