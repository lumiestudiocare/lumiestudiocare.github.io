import React from 'react';

// ── BUTTON ────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', children, className = '', ...props
}) => {
  const base = 'inline-flex items-center justify-center font-body transition-all duration-250 tracking-widest uppercase text-xs disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gold text-white hover:bg-gold-dark',
    ghost:   'bg-transparent text-brown border border-gold hover:bg-gold hover:text-white',
    outline: 'bg-transparent text-text-soft border border-nude hover:border-gold hover:text-brown',
    danger:  'bg-transparent text-red-500 border border-red-300 hover:bg-red-50',
  };
  const sizes = { sm: 'px-4 py-2 text-[.7rem]', md: 'px-6 py-3', lg: 'px-8 py-4' };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ letterSpacing: '0.18em' }}
      {...props}
    >
      {children}
    </button>
  );
};

// ── INPUT ─────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
    {label && (
      <label style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
        {label}
      </label>
    )}
    <input
      style={{
        width: '100%',
        padding: '.75rem 1rem',
        background: 'var(--white)',
        border: `1px solid ${error ? '#f87171' : 'var(--blush-dark)'}`,
        fontSize: '.9rem',
        color: 'var(--text)',
        transition: 'border-color .2s',
        borderRadius: '2px',
        fontFamily: 'var(--font-body)',
      }}
      {...props}
    />
    {error && <span style={{ fontSize: '.75rem', color: '#ef4444' }}>{error}</span>}
  </div>
);

// ── TEXTAREA ──────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, error, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
    {label && (
      <label style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
        {label}
      </label>
    )}
    <textarea
      rows={3}
      style={{
        width: '100%',
        padding: '.75rem 1rem',
        background: 'var(--white)',
        border: `1px solid ${error ? '#f87171' : 'var(--blush-dark)'}`,
        fontSize: '.9rem',
        color: 'var(--text)',
        resize: 'vertical',
        borderRadius: '2px',
        fontFamily: 'var(--font-body)',
      }}
      {...props}
    />
    {error && <span style={{ fontSize: '.75rem', color: '#ef4444' }}>{error}</span>}
  </div>
);

// ── BADGE ─────────────────────────────────────────────────────────
type BadgeVariant = 'pending' | 'confirmed' | 'cancelled' | 'completed';
const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  pending:   { background: '#fef3c7', color: '#d97706' },
  confirmed: { background: '#d1fae5', color: '#059669' },
  cancelled: { background: '#fee2e2', color: '#dc2626' },
  completed: { background: '#ede9fe', color: '#7c3aed' },
};
const badgeLabels: Record<BadgeVariant, string> = {
  pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado', completed: 'Concluído',
};
export const StatusBadge: React.FC<{ status: BadgeVariant }> = ({ status }) => (
  <span style={{
    ...badgeStyles[status],
    padding: '.25rem .75rem',
    fontSize: '.72rem',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    borderRadius: '2px',
    fontWeight: 500,
  }}>
    {badgeLabels[status]}
  </span>
);

// ── CARD ──────────────────────────────────────────────────────────
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }> = ({ children, style, className }) => (
  <div className={className} style={{
    background: 'var(--white)',
    boxShadow: 'var(--shadow-sm)',
    padding: '2rem',
    ...style,
  }}>
    {children}
  </div>
);

// ── MODAL ─────────────────────────────────────────────────────────
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(58,46,30,.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--white)', maxWidth: 480, width: '100%',
        padding: '2rem', boxShadow: 'var(--shadow-lg)',
        animation: 'fadeUp .3s ease both',
      }} onClick={e => e.stopPropagation()}>
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--brown)' }}>{title}</h3>
            <button onClick={onClose} style={{ fontSize: '1.2rem', color: 'var(--nude)', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
