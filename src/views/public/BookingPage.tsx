import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBookingViewModel } from '../../viewmodels';
import { SERVICES } from '../../services/data';
import { Button, Input, Textarea } from '../../components/ui';

const STEP_LABELS = ['Serviço', 'Data & Hora', 'Seus Dados', 'Pagamento', 'Confirmação'];

export const BookingPage: React.FC = () => {
  const vm = useBookingViewModel();

  // Read URL params for pre-selection (from service cards)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const prof    = params.get('prof');
    const status  = params.get('status');

    if (status) {
      // Returning from Mercado Pago
      vm.handlePaymentReturn().then(() => {
        (vm as any).setStep(5);
      });
    } else if (service) {
      // Pre-select service from service card click
      vm.updateForm('serviceId', service);
      if (prof) {
        setTimeout(() => vm.updateForm('professionalId', prof), 50);
      }
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: 'var(--blush)' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 5%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeUp .6s ease both' }}>
          <span className="eyebrow">Online</span>
          <h1 className="display-title">Agendar <em>Atendimento</em></h1>
        </div>

        {/* Stepper */}
        {vm.step < 5 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', animation: 'fadeUp .6s .1s ease both' }}>
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const active = n === vm.step;
              const done   = n < vm.step;
              return (
                <React.Fragment key={label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: done ? 'var(--gold)' : active ? 'var(--brown)' : 'var(--blush-dark)',
                      border: `2px solid ${done || active ? 'var(--gold)' : 'var(--nude)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: done || active ? 'white' : 'var(--nude)', fontSize: '.78rem', fontWeight: 500,
                      transition: 'all .3s',
                    }}>
                      {done ? '✓' : n}
                    </div>
                    <span style={{ fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', color: active ? 'var(--brown)' : 'var(--nude)' }}>
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div style={{ width: 40, height: 1, background: done ? 'var(--gold)' : 'var(--nude)', marginBottom: '1.2rem', transition: 'background .3s', flexShrink: 0 }} />
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
          {vm.step === 4 && <StepPayment vm={vm} />}
          {vm.step === 5 && <StepConfirmation vm={vm} />}
        </div>
      </div>
    </div>
  );
};

// ── STEP 1: Serviço & Profissional ────────────────────────────────
const StepService: React.FC<{ vm: ReturnType<typeof useBookingViewModel> }> = ({ vm }) => (
  <div>
    <SectionTitle title="Escolha o Serviço" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
      {SERVICES.map(s => (
        <SelectCard key={s.id} selected={vm.form.serviceId === s.id} onClick={() => vm.updateForm('serviceId', s.id)}>
          <span style={{ fontSize: '1.6rem', marginBottom: '.5rem', display: 'block' }}>{s.icon}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--brown)', display: 'block', marginBottom: '.3rem' }}>{s.name}</span>
          <span style={{ fontSize: '.72rem', color: 'var(--text-soft)' }}>{s.duration} min</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)', display: 'block', marginTop: '.3rem' }}>
            {vm.formatPrice(s.price)}
          </span>
        </SelectCard>
      ))}
    </div>
    {vm.errors.serviceId && <ErrorMsg msg={vm.errors.serviceId} />}

    {vm.form.serviceId && (
      <>
        <SectionTitle title="Escolha a Profissional" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {vm.availableProfessionals.map(p => (
            <SelectCard key={p.id} selected={vm.form.professionalId === p.id} onClick={() => vm.updateForm('professionalId', p.id)}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: 'var(--gold)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '1rem', margin: '0 auto .75rem',
              }}>{p.avatar}</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--brown)', display: 'block' }}>{p.name}</span>
              <span style={{ fontSize: '.72rem', color: 'var(--text-soft)' }}>{p.role}</span>
            </SelectCard>
          ))}
        </div>
        {vm.errors.professionalId && <ErrorMsg msg={vm.errors.professionalId} />}
      </>
    )}

    <NavButtons vm={vm} />
  </div>
);

// ── STEP 2: Data & Hora ───────────────────────────────────────────
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
          <h4 style={{ fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'capitalize', color: 'var(--nude)', marginBottom: '.75rem' }}>{month}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {vm.availableDates
              .filter(d => format(d, 'MMMM yyyy', { locale: ptBR }) === month)
              .map(d => {
                const iso = format(d, 'yyyy-MM-dd');
                const selected = vm.form.date === iso;
                const today = vm.isToday(d);
                return (
                  <button key={iso} onClick={() => vm.updateForm('date', iso)} style={{
                    padding: '.5rem .8rem', cursor: 'pointer', transition: 'all .2s',
                    background: selected ? 'var(--gold)' : 'var(--white)',
                    border: `1px solid ${selected ? 'var(--gold)' : today ? 'var(--nude)' : 'var(--blush-dark)'}`,
                    color: selected ? 'white' : 'var(--text)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50,
                  }}>
                    <span style={{ fontSize: '.58rem', textTransform: 'uppercase', letterSpacing: '.1em', opacity: .7 }}>
                      {format(d, 'EEE', { locale: ptBR })}
                    </span>
                    <span style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{format(d, 'd')}</span>
                    {today && <span style={{ fontSize: '.52rem', color: selected ? 'rgba(255,255,255,.8)' : 'var(--gold)' }}>hoje</span>}
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1rem' }}>
            {vm.availableSlots.map(slot => (
              <button key={slot.time} disabled={!slot.available}
                onClick={() => vm.updateForm('time', slot.time)}
                style={{
                  padding: '.5rem .9rem', cursor: slot.available ? 'pointer' : 'not-allowed',
                  background: vm.form.time === slot.time ? 'var(--gold)' : slot.available ? 'var(--white)' : 'var(--blush-dark)',
                  border: `1px solid ${vm.form.time === slot.time ? 'var(--gold)' : 'var(--blush-dark)'}`,
                  color: vm.form.time === slot.time ? 'white' : slot.available ? 'var(--text)' : 'var(--nude)',
                  fontSize: '.85rem', opacity: slot.available ? 1 : .5, transition: 'all .2s',
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

// ── STEP 3: Dados do cliente + Termos ─────────────────────────────
const StepContact: React.FC<{ vm: ReturnType<typeof useBookingViewModel> }> = ({ vm }) => (
  <div>
    {/* Summary */}
    <div style={{ background: 'var(--white)', padding: '1.2rem 1.5rem', marginBottom: '2rem', borderLeft: '3px solid var(--gold)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {[
        { label: 'Serviço',      value: vm.selectedService?.name },
        { label: 'Profissional', value: vm.selectedProfessional?.name },
        { label: 'Data',         value: vm.formatDate(vm.form.date) },
        { label: 'Horário',      value: vm.form.time },
        { label: 'Valor',        value: vm.selectedService ? vm.formatPrice(vm.selectedService.price) : '' },
      ].map(item => (
        <div key={item.label}>
          <span style={{ fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--nude)', display: 'block' }}>{item.label}</span>
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
      <Textarea label="Observações (opcional)" placeholder="Alergias, preferências ou informações importantes..." value={vm.form.notes} onChange={e => vm.updateForm('notes', e.target.value)} />
    </div>

    {/* Terms checkbox */}
    <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'var(--white)', border: `1px solid ${vm.termsError ? '#f87171' : 'var(--blush-dark)'}` }}>
      <label style={{ display: 'flex', gap: '.9rem', alignItems: 'flex-start', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={vm.termsAccepted}
          onChange={e => { vm.setTermsAccepted(e.target.checked); }}
          style={{ marginTop: '.2rem', width: 16, height: 16, accentColor: 'var(--gold)', cursor: 'pointer', flexShrink: 0 }}
        />
        <span style={{ fontSize: '.85rem', color: 'var(--text-soft)', lineHeight: 1.6 }}>
          Li e aceito os{' '}
          <Link to="/termos" target="_blank" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Termos de Uso</Link>,{' '}
          <Link to="/termos" target="_blank" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Política de Privacidade</Link>{' '}
          e a{' '}
          <Link to="/termos" target="_blank" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Política de Cancelamento</Link>{' '}
          do Lumiê Studio.
        </span>
      </label>
      {vm.termsError && <p style={{ fontSize: '.78rem', color: '#ef4444', marginTop: '.6rem', marginLeft: '1.6rem' }}>⚠ {vm.termsError}</p>}
    </div>

    <NavButtons vm={vm} isLast loading={vm.paymentLoading} />
  </div>
);

// ── STEP 4: Pagamento Mercado Pago ────────────────────────────────
const StepPayment: React.FC<{ vm: ReturnType<typeof useBookingViewModel> }> = ({ vm }) => (
  <div style={{ background: 'var(--white)', padding: '2.5rem', animation: 'fadeUp .5s ease both' }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(215,166,41,.1)', border: '2px solid var(--gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.6rem', margin: '0 auto 1.2rem',
      }}>🔐</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--brown)', marginBottom: '.6rem' }}>
        Finalizar Pagamento
      </h2>
      <p style={{ fontSize: '.88rem', color: 'var(--text-soft)', lineHeight: 1.7 }}>
        Seu agendamento foi registrado. Complete o pagamento para confirmar.
      </p>
    </div>

    {/* Resumo */}
    <div style={{ background: 'var(--blush)', padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          { label: 'Código',       value: `#${vm.submittedId?.slice(-6).toUpperCase()}` },
          { label: 'Serviço',      value: vm.selectedService?.name },
          { label: 'Profissional', value: vm.selectedProfessional?.name },
          { label: 'Data & Hora',  value: `${vm.formatDate(vm.form.date)} às ${vm.form.time}` },
          { label: 'Cliente',      value: vm.form.clientName },
          { label: 'Valor total',  value: vm.selectedService ? vm.formatPrice(vm.selectedService.price) : '' },
        ].map(item => (
          <div key={item.label}>
            <span style={{ fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--nude)', display: 'block' }}>{item.label}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', color: 'var(--brown)' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Métodos */}
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      {[
        { icon: '⚡', label: 'PIX', sub: 'Aprovação imediata' },
        { icon: '💳', label: 'Cartão de Crédito', sub: 'Até 12x' },
        { icon: '💳', label: 'Cartão de Débito', sub: 'Aprovação rápida' },
      ].map(m => (
        <div key={m.label} style={{
          padding: '.8rem 1.2rem', border: '1px solid var(--blush-dark)', background: 'var(--white)',
          display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.82rem', color: 'var(--text-soft)',
        }}>
          <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>
          <div>
            <div style={{ color: 'var(--brown)', fontWeight: 500 }}>{m.label}</div>
            <div style={{ fontSize: '.7rem' }}>{m.sub}</div>
          </div>
        </div>
      ))}
    </div>

    <p style={{ fontSize: '.75rem', color: 'var(--nude)', textAlign: 'center', marginBottom: '1.5rem' }}>
      🔒 Pagamento processado com segurança pelo <strong>Mercado Pago</strong>
    </p>

    <button
      onClick={vm.goToPayment}
      disabled={vm.paymentLoading}
      style={{
        width: '100%', padding: '1rem', background: 'var(--gold)', color: 'white', border: 'none',
        fontSize: '.85rem', letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer',
        transition: 'background .25s', opacity: vm.paymentLoading ? .6 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem',
      }}
      onMouseEnter={e => { if (!vm.paymentLoading) (e.currentTarget.style.background = 'var(--gold-dark)'); }}
      onMouseLeave={e => { (e.currentTarget.style.background = 'var(--gold)'); }}
    >
      {vm.paymentLoading ? '⏳ Aguarde...' : `Pagar ${vm.selectedService ? vm.formatPrice(vm.selectedService.price) : ''} →`}
    </button>

    <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.75rem', color: 'var(--nude)' }}>
      Ao pagar, você confirma ter aceito os{' '}
      <Link to="/termos" target="_blank" style={{ color: 'var(--gold)' }}>termos e políticas</Link> do estúdio.
    </p>
  </div>
);

// ── STEP 5: Confirmação final ─────────────────────────────────────
const StepConfirmation: React.FC<{ vm: ReturnType<typeof useBookingViewModel> }> = ({ vm }) => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const isApproved = status === 'approved';
  const isPending  = status === 'pending';

  return (
    <div style={{ background: 'var(--white)', padding: '3rem 2.5rem', textAlign: 'center', animation: 'fadeUp .5s ease both' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: isApproved ? 'rgba(16,185,129,.1)' : 'rgba(215,166,41,.12)',
        border: `2px solid ${isApproved ? '#10b981' : 'var(--gold)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.8rem', margin: '0 auto 1.5rem',
      }}>
        {isApproved ? '✅' : isPending ? '⏳' : '🦋'}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--brown)', marginBottom: '.75rem' }}>
        {isApproved ? 'Agendamento Confirmado!' : isPending ? 'Pagamento em análise' : 'Agendamento Solicitado!'}
      </h2>
      <p style={{ fontSize: '.9rem', color: 'var(--text-soft)', marginBottom: '2rem', lineHeight: 1.8, maxWidth: 460, margin: '0 auto 2rem' }}>
        {isApproved
          ? 'Pagamento aprovado! Você e a profissional receberam um e-mail de confirmação. Até logo! 🌸'
          : isPending
          ? 'Seu pagamento está sendo processado. Assim que confirmado, você receberá um e-mail. 🌿'
          : 'Recebemos seu pedido e já notificamos a profissional. Conclua o pagamento para confirmar. 🌸'}
      </p>

      <div style={{ background: 'var(--blush)', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', maxWidth: 460, margin: '0 auto 2rem' }}>
        {[
          { label: 'Código',       value: `#${vm.submittedId?.slice(-6).toUpperCase()}` },
          { label: 'Serviço',      value: vm.selectedService?.name },
          { label: 'Profissional', value: vm.selectedProfessional?.name },
          { label: 'Data',         value: vm.formatDate(vm.form.date) },
          { label: 'Horário',      value: vm.form.time },
          { label: 'Status',       value: isApproved ? '✅ Confirmado' : isPending ? '⏳ Pendente' : '🕐 Aguardando' },
        ].map(item => (
          <div key={item.label}>
            <span style={{ fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--nude)', display: 'block' }}>{item.label}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', color: 'var(--brown)' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button onClick={vm.reset} variant="ghost">Novo agendamento</Button>
        <Link to="/" style={{
          padding: '.75rem 1.5rem', border: '1px solid var(--nude)', color: 'var(--text-soft)',
          fontSize: '.75rem', letterSpacing: '.18em', textTransform: 'uppercase',
        }}>Voltar ao início</Link>
        {!isApproved && !isPending && (
          <Button onClick={vm.goToPayment} disabled={vm.paymentLoading}>
            {vm.paymentLoading ? 'Aguarde...' : 'Ir para pagamento →'}
          </Button>
        )}
      </div>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────
const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--brown)', marginBottom: '1.2rem', marginTop: '1.5rem' }}>{title}</h3>
);

const ErrorMsg: React.FC<{ msg: string }> = ({ msg }) => (
  <p style={{ fontSize: '.8rem', color: '#ef4444', marginTop: '-.5rem', marginBottom: '1rem' }}>⚠ {msg}</p>
);

const SelectCard: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({ selected, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '1.5rem 1rem', textAlign: 'center', width: '100%', cursor: 'pointer',
    background: selected ? 'rgba(215,166,41,.08)' : 'var(--white)',
    border: `1.5px solid ${selected ? 'var(--gold)' : 'var(--blush-dark)'}`,
    transition: 'all .2s',
    transform: selected ? 'translateY(-2px)' : 'none',
    boxShadow: selected ? 'var(--shadow-md)' : 'none',
  }}>
    {children}
  </button>
);

const NavButtons: React.FC<{
  vm: ReturnType<typeof useBookingViewModel>;
  isLast?: boolean;
  loading?: boolean;
}> = ({ vm, isLast, loading }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--blush-dark)' }}>
    {vm.step > 1 ? <Button variant="outline" onClick={vm.prevStep}>← Voltar</Button> : <span />}
    {isLast
      ? <Button onClick={vm.submit} disabled={loading}>{loading ? 'Processando...' : 'Continuar para Pagamento →'}</Button>
      : <Button onClick={vm.nextStep}>Continuar →</Button>}
  </div>
);
