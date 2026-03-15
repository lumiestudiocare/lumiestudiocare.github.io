import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBookingViewModel } from '../../viewmodels';
import { SERVICES } from '../../services/data';
import { Button, Input, Textarea } from '../../components/ui';

const STEP_LABELS = ['Serviço', 'Data & Hora', 'Seus Dados', 'Confirmação'];

export const BookingPage: React.FC = () => {
  const vm = useBookingViewModel();

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: 'var(--blush)' }}>
      <div className="container" style={{ maxWidth: 780, padding: '3rem 5%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeUp .6s ease both' }}>
          <span className="eyebrow">Online</span>
          <h1 className="display-title">Agendar <em>Atendimento</em></h1>
        </div>

        {/* Stepper */}
        {vm.step < 4 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2.5rem', gap: '0',
            animation: 'fadeUp .6s .1s ease both',
          }}>
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const active = n === vm.step;
              const done = n < vm.step;
              return (
                <React.Fragment key={label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: done ? 'var(--gold)' : active ? 'var(--brown)' : 'var(--blush-dark)',
                      border: `2px solid ${done || active ? 'var(--gold)' : 'var(--nude)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: done || active ? 'white' : 'var(--nude)',
                      fontSize: '.8rem', fontWeight: 500,
                      transition: 'all .3s',
                    }}>
                      {done ? '✓' : n}
                    </div>
                    <span style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: active ? 'var(--brown)' : 'var(--nude)' }}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div style={{ width: 60, height: 1, background: done ? 'var(--gold)' : 'var(--nude)', marginBottom: '1.2rem', transition: 'background .3s' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Steps */}
        <div style={{ animation: 'fadeUp .5s ease both' }}>
          {vm.step === 1 && <StepService vm={vm} />}
          {vm.step === 2 && <StepDateTime vm={vm} />}
          {vm.step === 3 && <StepContact vm={vm} />}
          {vm.step === 4 && <StepConfirmation vm={vm} />}
        </div>
      </div>
    </div>
  );
};

// ── STEP 1: Service & Professional ───────────────────────────────
const StepService: React.FC<{ vm: ReturnType<typeof useBookingViewModel> }> = ({ vm }) => (
  <div>
    <SectionTitle title="Escolha o Serviço" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {SERVICES.map(s => (
        <SelectCard
          key={s.id}
          selected={vm.form.serviceId === s.id}
          onClick={() => vm.updateForm('serviceId', s.id)}
        >
          <span style={{ fontSize: '1.6rem', marginBottom: '.5rem', display: 'block' }}>{s.icon}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--brown)', display: 'block', marginBottom: '.3rem' }}>{s.name}</span>
          <span style={{ fontSize: '.75rem', color: 'var(--text-soft)' }}>{s.duration} min · R$ {s.price}</span>
        </SelectCard>
      ))}
    </div>
    {vm.errors.serviceId && <ErrorMsg msg={vm.errors.serviceId} />}

    {vm.form.serviceId && (
      <>
        <SectionTitle title="Escolha a Profissional" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {vm.availableProfessionals.map(p => (
            <SelectCard
              key={p.id}
              selected={vm.form.professionalId === p.id}
              onClick={() => vm.updateForm('professionalId', p.id)}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--gold)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '1rem',
                margin: '0 auto .75rem',
              }}>{p.avatar}</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--brown)', display: 'block' }}>{p.name}</span>
              <span style={{ fontSize: '.75rem', color: 'var(--text-soft)' }}>{p.role}</span>
            </SelectCard>
          ))}
        </div>
        {vm.errors.professionalId && <ErrorMsg msg={vm.errors.professionalId} />}
      </>
    )}

    <NavButtons vm={vm} />
  </div>
);

// ── STEP 2: Date & Time ───────────────────────────────────────────
const StepDateTime: React.FC<{ vm: ReturnType<typeof useBookingViewModel> }> = ({ vm }) => {
  const months: string[] = [];
  vm.availableDates.forEach(d => {
    const m = format(d, 'MMMM yyyy', { locale: ptBR });
    if (!months.includes(m)) months.push(m);
  });

  return (
    <div>
      <SectionTitle title="Selecione a Data" />
      {months.map(month => (
        <div key={month} style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'capitalize', color: 'var(--nude)', marginBottom: '.75rem' }}>{month}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem' }}>
            {vm.availableDates
              .filter(d => format(d, 'MMMM yyyy', { locale: ptBR }) === month)
              .map(d => {
                const iso = format(d, 'yyyy-MM-dd');
                const selected = vm.form.date === iso;
                const today = vm.isToday(d);
                return (
                  <button key={iso} onClick={() => vm.updateForm('date', iso)} style={{
                    padding: '.5rem .9rem',
                    background: selected ? 'var(--gold)' : 'var(--white)',
                    border: `1px solid ${selected ? 'var(--gold)' : today ? 'var(--nude)' : 'var(--blush-dark)'}`,
                    color: selected ? 'white' : 'var(--text)',
                    fontSize: '.85rem', cursor: 'pointer',
                    transition: 'all .2s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52,
                  }}>
                    <span style={{ fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', opacity: .7 }}>
                      {format(d, 'EEE', { locale: ptBR })}
                    </span>
                    <span style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{format(d, 'd')}</span>
                    {today && <span style={{ fontSize: '.55rem', color: selected ? 'rgba(255,255,255,.8)' : 'var(--gold)' }}>hoje</span>}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
      {vm.errors.date && <ErrorMsg msg={vm.errors.date} />}

      {vm.form.date && (
        <>
          <SectionTitle title="Selecione o Horário" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem', marginBottom: '1rem' }}>
            {vm.availableSlots.map(slot => (
              <button key={slot.time} disabled={!slot.available}
                onClick={() => vm.updateForm('time', slot.time)}
                style={{
                  padding: '.55rem 1rem',
                  background: vm.form.time === slot.time ? 'var(--gold)' : slot.available ? 'var(--white)' : 'var(--blush-dark)',
                  border: `1px solid ${vm.form.time === slot.time ? 'var(--gold)' : 'var(--blush-dark)'}`,
                  color: vm.form.time === slot.time ? 'white' : slot.available ? 'var(--text)' : 'var(--nude)',
                  fontSize: '.85rem', cursor: slot.available ? 'pointer' : 'not-allowed',
                  opacity: slot.available ? 1 : .5, transition: 'all .2s',
                  textDecoration: slot.available ? 'none' : 'line-through',
                }}>
                {slot.time}
              </button>
            ))}
          </div>
          {vm.errors.time && <ErrorMsg msg={vm.errors.time} />}
        </>
      )}

      <NavButtons vm={vm} />
    </div>
  );
};

// ── STEP 3: Contact Info ──────────────────────────────────────────
const StepContact: React.FC<{ vm: ReturnType<typeof useBookingViewModel> }> = ({ vm }) => (
  <div>
    {/* Summary */}
    <div style={{
      background: 'var(--white)', padding: '1.2rem 1.5rem', marginBottom: '2rem',
      borderLeft: '3px solid var(--gold)',
      display: 'flex', gap: '2rem', flexWrap: 'wrap',
    }}>
      {[
        { label: 'Serviço', value: vm.selectedService?.name },
        { label: 'Profissional', value: vm.selectedProfessional?.name },
        { label: 'Data', value: vm.formatDate(vm.form.date) },
        { label: 'Horário', value: vm.form.time },
      ].map(item => (
        <div key={item.label}>
          <span style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--nude)', display: 'block' }}>{item.label}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--brown)' }}>{item.value}</span>
        </div>
      ))}
    </div>

    <SectionTitle title="Seus Dados" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <Input label="Nome completo *" placeholder="Seu nome" value={vm.form.clientName} onChange={e => vm.updateForm('clientName', e.target.value)} error={vm.errors.clientName} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input label="Telefone / WhatsApp *" placeholder="(11) 9 9999-9999" value={vm.form.clientPhone} onChange={e => vm.updateForm('clientPhone', e.target.value)} error={vm.errors.clientPhone} />
        <Input label="E-mail *" placeholder="seu@email.com" type="email" value={vm.form.clientEmail} onChange={e => vm.updateForm('clientEmail', e.target.value)} error={vm.errors.clientEmail} />
      </div>
      <Textarea label="Observações (opcional)" placeholder="Alguma informação importante para a profissional..." value={vm.form.notes} onChange={e => vm.updateForm('notes', e.target.value)} />
    </div>

    <NavButtons vm={vm} isLast />
  </div>
);

// ── STEP 4: Confirmation ──────────────────────────────────────────
const StepConfirmation: React.FC<{ vm: ReturnType<typeof useBookingViewModel> }> = ({ vm }) => (
  <div style={{
    background: 'var(--white)', padding: '3rem 2.5rem', textAlign: 'center',
    animation: 'fadeUp .5s ease both',
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'rgba(215,166,41,.12)', border: '2px solid var(--gold)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.8rem', margin: '0 auto 1.5rem',
    }}>🦋</div>

    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--brown)', marginBottom: '.75rem' }}>
      Agendamento Solicitado!
    </h2>
    <p style={{ fontSize: '.9rem', color: 'var(--text-soft)', marginBottom: '2rem', lineHeight: 1.8 }}>
      Recebemos seu pedido. Em breve nossa equipe entrará em contato para confirmar. 🌸
    </p>

    <div style={{
      background: 'var(--blush)', padding: '1.5rem', marginBottom: '2rem',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left',
    }}>
      {[
        { label: 'Código', value: `#${vm.submittedId?.slice(-6).toUpperCase()}` },
        { label: 'Serviço', value: vm.selectedService?.name },
        { label: 'Profissional', value: vm.selectedProfessional?.name },
        { label: 'Data', value: vm.formatDate(vm.form.date) },
        { label: 'Horário', value: vm.form.time },
        { label: 'Cliente', value: vm.form.clientName },
      ].map(item => (
        <div key={item.label}>
          <span style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--nude)', display: 'block' }}>{item.label}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', color: 'var(--brown)' }}>{item.value}</span>
        </div>
      ))}
    </div>

    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Button onClick={vm.reset} variant="ghost">Novo agendamento</Button>
      <Link to="/" style={{
        padding: '.75rem 1.5rem', background: 'transparent',
        border: '1px solid var(--nude)', color: 'var(--text-soft)',
        fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase',
      }}>Voltar ao início</Link>
    </div>
  </div>
);

// ── HELPERS ───────────────────────────────────────────────────────
const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--brown)', marginBottom: '1.2rem', marginTop: '1.5rem' }}>{title}</h3>
);

const ErrorMsg: React.FC<{ msg: string }> = ({ msg }) => (
  <p style={{ fontSize: '.8rem', color: '#ef4444', marginTop: '-.5rem', marginBottom: '1rem' }}>⚠ {msg}</p>
);

const SelectCard: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({ selected, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '1.5rem 1rem', textAlign: 'center',
    background: selected ? 'rgba(215,166,41,.08)' : 'var(--white)',
    border: `1.5px solid ${selected ? 'var(--gold)' : 'var(--blush-dark)'}`,
    cursor: 'pointer', transition: 'all .2s', width: '100%',
    transform: selected ? 'translateY(-2px)' : 'none',
    boxShadow: selected ? 'var(--shadow-md)' : 'none',
  }}>
    {children}
  </button>
);

const NavButtons: React.FC<{ vm: ReturnType<typeof useBookingViewModel>; isLast?: boolean }> = ({ vm, isLast }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--blush-dark)' }}>
    {vm.step > 1
      ? <Button variant="outline" onClick={vm.prevStep}>← Voltar</Button>
      : <span />}
    {isLast
      ? <Button onClick={vm.submit}>Confirmar Agendamento ✓</Button>
      : <Button onClick={vm.nextStep}>Continuar →</Button>}
  </div>
);
