import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TAB_NAV = [
  { label: 'Termos de Uso',   to: '/termos/uso' },
  { label: 'Privacidade',     to: '/termos/privacidade' },
  { label: 'Cancelamento',    to: '/termos/cancelamento' },
];

const Section: React.FC<{ num: string; title: string; children: React.ReactNode }> = ({ num, title, children }) => (
  <div style={{ marginBottom: '2.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem', paddingBottom: '.75rem', borderBottom: '1px solid var(--blush-dark)' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'rgba(215,166,41,.25)', lineHeight: 1, flexShrink: 0 }}>{num}</span>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--brown)' }}>{title}</h2>
    </div>
    <div style={{ fontSize: '.9rem', lineHeight: 1.9, color: 'var(--text-soft)', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>{children}</div>
  </div>
);
const Ul: React.FC<{ items: string[] }> = ({ items }) => (
  <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
    {items.map((item, i) => <li key={i}><span style={{ color: 'var(--gold)', marginRight: '.5rem' }}>✦</span>{item}</li>)}
  </ul>
);

export const TermsOfUsePage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', background: 'var(--blush)', paddingBottom: '6rem' }}>
      <div style={{ background: 'var(--brown)', padding: '3rem 5%' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <span style={{ fontSize: '.68rem', letterSpacing: '.35em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '.6rem' }}>Lumiê Studio</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 300, color: 'var(--blush)' }}>Termos de Uso</h1>
          <p style={{ fontSize: '.8rem', color: 'rgba(248,240,245,.45)', marginTop: '.5rem' }}>Última atualização: março de 2025 · Versão 1.0</p>
        </div>
      </div>
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--blush-dark)', position: 'sticky', top: 64, zIndex: 50 }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 5%', display: 'flex', overflowX: 'auto' }}>
          {TAB_NAV.map(t => (
            <Link key={t.to} to={t.to} style={{ padding: '.85rem 1.3rem', fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase', whiteSpace: 'nowrap', textDecoration: 'none', borderBottom: t.to === '/termos/uso' ? '2px solid var(--gold)' : '2px solid transparent', color: t.to === '/termos/uso' ? 'var(--brown)' : 'var(--text-soft)' }}>{t.label}</Link>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '3rem 5%' }}>
        <div style={{ background: 'var(--white)', borderLeft: '3px solid var(--gold)', padding: '1.2rem 1.5rem', marginBottom: '3rem', fontSize: '.88rem', color: 'var(--text-soft)', lineHeight: 1.8 }}>
          Ao utilizar o site ou realizar um agendamento no <strong style={{ color: 'var(--brown)' }}>Lumiê Studio</strong>, você declara ter lido e concordado com estes Termos. Caso não concorde, pedimos que não utilize nossos serviços.
        </div>
        <Section num="01" title="Identificação">
          <p><strong style={{ color: 'var(--brown)' }}>Lumiê Studio — Beleza &amp; Estética</strong></p>
          <p>R. Areado, 11 — Conj. Hab. Pres. Castelo Branco, Carapicuíba — SP, CEP 06327-170</p>
          <p>ola@lumiestudio.com.br · (11) 99529-7274</p>
        </Section>
        <Section num="02" title="Serviços oferecidos">
          <p>O Lumiê Studio oferece presencialmente, mediante agendamento:</p>
          <Ul items={['Skincare & Facial — limpeza, hidratação, peeling e anti-aging','Manicure & Nail Art — manicure, pedicure, gel e nail art','Design de Sobrancelhas — henna, micropigmentação e brow lamination','Spa & Relaxamento — massagens faciais e aromaterapia','Consultoria de Beleza — coloração pessoal e rotina de skincare']} />
        </Section>
        <Section num="03" title="Uso do sistema de agendamento">
          <p>Para agendar, o usuário deve:</p>
          <Ul items={['Ser maior de 18 anos ou estar acompanhado de responsável legal','Fornecer informações verdadeiras e atualizadas','Aceitar estes Termos antes de concluir o agendamento','Efetuar o pagamento para confirmação do horário']} />
          <p>O agendamento é <strong>confirmado</strong> somente após aprovação do pagamento. Solicitações sem pagamento ficam pendentes e podem ser canceladas automaticamente em até 2 horas.</p>
        </Section>
        <Section num="04" title="Obrigações do cliente">
          <Ul items={['Comparecer no horário agendado — tolerância de até 15 minutos','Informar previamente alergias, doenças ou contraindicações relevantes','Tratar as profissionais e colaboradoras com respeito e cordialidade','Não comparecer com doenças contagiosas (reagendamento gratuito nesses casos)']} />
        </Section>
        <Section num="05" title="Obrigações do Lumiê Studio">
          <Ul items={['Prestar os serviços com qualidade, higiene e profissionalismo','Disponibilizar profissionais qualificadas e habilitadas','Notificar o cliente com ao menos 2 horas de antecedência em caso de cancelamento por nossa parte','Oferecer reagendamento gratuito ou reembolso integral nos cancelamentos de nossa responsabilidade']} />
        </Section>
        <Section num="06" title="Pagamentos">
          <p>Aceitamos: PIX (aprovação imediata), cartão de crédito e débito via Mercado Pago. Não armazenamos dados de cartão — todo o processamento é realizado com segurança pelo Mercado Pago (certificação PCI DSS).</p>
        </Section>
        <Section num="07" title="Propriedade intelectual">
          <p>Todo o conteúdo deste site — textos, imagens, logotipo, marca "Lumiê Studio" e software — é protegido pela Lei nº 9.610/1998. Reprodução sem autorização prévia por escrito é vedada.</p>
        </Section>
        <Section num="08" title="Cancelamento e reembolso">
          <p>Consulte nossa <Link to="/termos/cancelamento" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Política de Cancelamento e Reembolso</Link> para todas as condições.</p>
        </Section>
        <Section num="09" title="Foro e legislação">
          <p>Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de Carapicuíba/SP para dirimir quaisquer controvérsias.</p>
        </Section>
      </div>
      <div style={{ background: 'var(--white)', padding: '2rem 5%', borderTop: '1px solid var(--blush-dark)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/termos/privacidade" style={{ fontSize: '.78rem', color: 'var(--gold)' }}>Política de Privacidade →</Link>
            <Link to="/termos/cancelamento" style={{ fontSize: '.78rem', color: 'var(--gold)' }}>Política de Cancelamento →</Link>
          </div>
          <Link to="/" style={{ fontSize: '.75rem', color: 'var(--text-soft)' }}>← Voltar ao site</Link>
        </div>
      </div>
    </div>
  );
};
