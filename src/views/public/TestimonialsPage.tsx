import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReveal } from '../../hooks/useReveal';
import { supabase } from '../../services/supabase';
import { SERVICES } from '../../services/data';

interface Testimonial {
  id: string;
  client_name: string;
  service_id: string;
  rating: number;
  text: string;
  created_at: string;
}

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useReveal();
  return <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
};

const Stars: React.FC<{ rating: number; interactive?: boolean; onChange?: (r: number) => void }> = ({ rating, interactive, onChange }) => (
  <div style={{ display: 'flex', gap: '.2rem' }}>
    {[1,2,3,4,5].map(n => (
      <span key={n}
        onClick={() => interactive && onChange?.(n)}
        style={{
          fontSize: interactive ? '1.6rem' : '1rem',
          color: n <= rating ? 'var(--gold)' : 'var(--blush-dark)',
          cursor: interactive ? 'pointer' : 'default',
          transition: 'color .15s, transform .15s',
          display: 'inline-block',
          lineHeight: 1,
        }}
        onMouseEnter={e => { if (interactive) (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'; }}
        onMouseLeave={e => { if (interactive) (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
      >★</span>
    ))}
  </div>
);

export const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({ client_name: '', service_id: '', rating: 5, text: '' });
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    setTestimonials((data as Testimonial[]) ?? []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name.trim()) return setFormError('Por favor, informe seu nome.');
    if (!form.service_id) return setFormError('Selecione o serviço realizado.');
    if (!form.text.trim() || form.text.length < 20) return setFormError('Escreva pelo menos 20 caracteres.');
    setFormError('');
    setSubmitting(true);
    const { error } = await supabase.from('testimonials').insert({
      ...form,
      approved: false, // admin needs to approve
    });
    setSubmitting(false);
    if (error) { setFormError('Erro ao enviar. Tente novamente.'); return; }
    setSubmitted(true);
  };

  const getServiceName = (id: string) => SERVICES.find(s => s.id === id)?.name ?? id;

  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: 'var(--blush)', paddingBottom: '80px' }}>

      {/* ── HERO ── */}
      <div style={{ background: 'var(--brown)', padding: '4rem 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(215,166,41,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <span style={{ fontSize: '.72rem', letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '.8rem' }}>
          O que dizem sobre nós
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: 'var(--blush)', lineHeight: 1.2, marginBottom: '1rem' }}>
          Experiências que <em style={{ color: 'var(--gold)' }}>transformam</em>
        </h1>

        {/* Rating summary */}
        {!loading && testimonials.length > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', background: 'rgba(248,240,245,.08)', padding: '.8rem 1.8rem', borderRadius: 40 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold)', lineHeight: 1 }}>{avgRating}</span>
            <div>
              <Stars rating={Math.round(Number(avgRating))} />
              <span style={{ fontSize: '.72rem', color: 'rgba(248,240,245,.6)', display: 'block', marginTop: '.2rem' }}>
                {testimonials.length} avaliação{testimonials.length > 1 ? 'ões' : ''}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── TESTIMONIALS GRID ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 5%' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--blush-dark)', borderTopColor: 'var(--gold)', animation: 'spin .7s linear infinite' }} />
          </div>
        ) : testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--nude)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Seja a primeira a avaliar! 🌸</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <div style={{
                  background: 'var(--white)', padding: '2rem',
                  borderBottom: '2px solid var(--gold)',
                  transition: 'transform .3s, box-shadow .3s',
                  height: '100%',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(114,94,58,.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--gold), var(--brown))',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '1rem',
                    }}>
                      {t.client_name.trim()[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--brown)', lineHeight: 1.2 }}>{t.client_name}</p>
                      <p style={{ fontSize: '.72rem', color: 'var(--nude)', marginTop: '.1rem' }}>{getServiceName(t.service_id)}</p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <Stars rating={t.rating} />
                    </div>
                  </div>

                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--brown)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    "{t.text}"
                  </p>

                  <span style={{ fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--nude)' }}>
                    {format(new Date(t.created_at), "MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* ── REVIEW FORM ── */}
      <section style={{ background: 'var(--white)', padding: '5rem 5%' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '.72rem', letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '.8rem' }}>
                Compartilhe sua experiência
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 300, color: 'var(--brown)' }}>
                Deixe seu <em style={{ fontStyle: 'italic' }}>depoimento</em>
              </h2>
              <p style={{ fontSize: '.88rem', color: 'var(--text-soft)', marginTop: '.8rem', lineHeight: 1.8 }}>
                Sua avaliação será revisada e publicada em breve. 🌸
              </p>
            </div>
          </Reveal>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--blush)', animation: 'fadeUp .5s ease both' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦋</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '.8rem' }}>
                Obrigada pelo carinho!
              </h3>
              <p style={{ fontSize: '.9rem', color: 'var(--text-soft)', marginBottom: '2rem', lineHeight: 1.8 }}>
                Seu depoimento foi recebido e será publicado após aprovação. 💛
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => { setSubmitted(false); setForm({ client_name: '', service_id: '', rating: 5, text: '' }); }}
                  style={{ padding: '.7rem 1.6rem', border: '1px solid var(--gold)', background: 'transparent', color: 'var(--brown)', fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Enviar outro
                </button>
                <Link to="/agendar" style={{ padding: '.7rem 1.6rem', background: 'var(--gold)', color: 'white', fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>
                  Agendar novamente
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem', animation: 'fadeUp .5s ease both' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                  <label style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>Seu nome *</label>
                  <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                    placeholder="Como quer ser identificada"
                    style={{ padding: '.75rem 1rem', border: '1px solid var(--blush-dark)', background: 'var(--blush)', fontSize: '.9rem', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color .2s' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--blush-dark)')}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                  <label style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>Serviço realizado *</label>
                  <select value={form.service_id} onChange={e => setForm(f => ({ ...f, service_id: e.target.value }))}
                    style={{ padding: '.75rem 1rem', border: '1px solid var(--blush-dark)', background: 'var(--blush)', fontSize: '.9rem', color: form.service_id ? 'var(--text)' : 'var(--nude)', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color .2s', cursor: 'pointer' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--blush-dark)')}
                  >
                    <option value="">Selecione...</option>
                    {SERVICES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Star rating */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                <label style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>Sua avaliação *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Stars rating={form.rating} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
                  <span style={{ fontSize: '.85rem', color: 'var(--text-soft)' }}>
                    {['', 'Ruim', 'Regular', 'Bom', 'Ótimo', 'Excelente!'][form.rating]}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                <label style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
                  Seu depoimento * <span style={{ color: 'var(--nude)', textTransform: 'none', letterSpacing: 0 }}>({form.text.length}/20 min)</span>
                </label>
                <textarea rows={4} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Conte como foi sua experiência no Lumiê Studio..."
                  style={{ padding: '.75rem 1rem', border: '1px solid var(--blush-dark)', background: 'var(--blush)', fontSize: '.9rem', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical', transition: 'border-color .2s' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--blush-dark)')}
                />
              </div>

              {formError && (
                <p style={{ fontSize: '.82rem', color: '#ef4444', background: '#fee2e2', padding: '.7rem 1rem' }}>⚠ {formError}</p>
              )}

              <button type="submit" disabled={submitting} style={{
                padding: '.9rem', background: 'var(--gold)', color: 'white', border: 'none',
                fontSize: '.8rem', letterSpacing: '.2em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'background .25s', opacity: submitting ? .6 : 1,
                fontFamily: 'var(--font-body)',
              }}
                onMouseEnter={e => { if (!submitting) (e.currentTarget.style.background = 'var(--gold-dark)'); }}
                onMouseLeave={e => { (e.currentTarget.style.background = 'var(--gold)'); }}
              >
                {submitting ? 'Enviando...' : 'Enviar depoimento 🌸'}
              </button>

              <p style={{ fontSize: '.75rem', color: 'var(--nude)', textAlign: 'center' }}>
                Seu depoimento será publicado após revisão da equipe.
              </p>
            </form>
          )}
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
