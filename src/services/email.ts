import emailjs from '@emailjs/browser';
import type { Booking } from '../models';
import { SERVICES, PROFESSIONALS } from './data';

const EJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'YOUR_SERVICE_ID';
const EJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'YOUR_PUBLIC_KEY';

// Apenas 2 templates (plano gratuito)
const TPL_PROFESSIONAL = import.meta.env.VITE_EMAILJS_TPL_PROF   ?? 'template_professional';
const TPL_CLIENT       = import.meta.env.VITE_EMAILJS_TPL_CLIENT ?? 'template_client';

const PROF_EMAILS: Record<string, string> = {
  'prof-1': import.meta.env.VITE_EMAIL_SIMONE  ?? 'simone@lumiestudio.com.br',
  'prof-2': import.meta.env.VITE_EMAIL_RAFAELA ?? 'rafaela@lumiestudio.com.br',
  'prof-3': import.meta.env.VITE_EMAIL_DANI    ?? 'dani@lumiestudio.com.br',
};

emailjs.init(EJS_PUBLIC_KEY);

const getServiceName = (id: string) => SERVICES.find(s => s.id === id)?.name ?? id;
const getProfName    = (id: string) => PROFESSIONALS.find(p => p.id === id)?.name ?? id;
const formatDate     = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    .format(new Date(y, m - 1, d));
};

// ── Envia para profissional (novo agendamento) ────────────────────
export async function notifyProfessional(booking: Booking): Promise<void> {
  const profEmail = PROF_EMAILS[booking.professionalId];
  if (!profEmail) return;

  await emailjs.send(EJS_SERVICE_ID, TPL_PROFESSIONAL, {
    to_email:     profEmail,
    prof_name:    getProfName(booking.professionalId),
    client_name:  booking.clientName,
    client_phone: booking.clientPhone,
    client_email: booking.clientEmail,
    service_name: getServiceName(booking.serviceId),
    date:         formatDate(booking.date),
    time:         booking.time,
    notes:        booking.notes || 'Nenhuma observação',
    booking_id:   `#${booking.id.slice(-6).toUpperCase()}`,
    status:       '🕐 Aguardando pagamento',
  });
}

// ── Envia para cliente (agendamento recebido) ─────────────────────
export async function notifyClient(booking: Booking): Promise<void> {
  await emailjs.send(EJS_SERVICE_ID, TPL_CLIENT, {
    to_email:     booking.clientEmail,
    client_name:  booking.clientName,
    service_name: getServiceName(booking.serviceId),
    prof_name:    getProfName(booking.professionalId),
    date:         formatDate(booking.date),
    time:         booking.time,
    booking_id:   `#${booking.id.slice(-6).toUpperCase()}`,
    studio_phone: '(11) 99529-7274',
    subject:      'Lumiê Studio — Agendamento recebido 🦋',
    message:      'Recebemos seu agendamento! Finalize o pagamento para confirmar sua vaga.',
  });
}

// ── Confirma pagamento — reaproveita os 2 templates ───────────────
export async function notifyPaymentConfirmed(booking: Booking, amount: number): Promise<void> {
  const profEmail = PROF_EMAILS[booking.professionalId];
  const amountFmt = `R$ ${amount.toFixed(2).replace('.', ',')}`;

  // Para a cliente
  await emailjs.send(EJS_SERVICE_ID, TPL_CLIENT, {
    to_email:     booking.clientEmail,
    client_name:  booking.clientName,
    service_name: getServiceName(booking.serviceId),
    prof_name:    getProfName(booking.professionalId),
    date:         formatDate(booking.date),
    time:         booking.time,
    booking_id:   `#${booking.id.slice(-6).toUpperCase()}`,
    studio_phone: '(11) 99529-7274',
    subject:      'Lumiê Studio — Pagamento confirmado ✅',
    message:      `Seu pagamento de ${amountFmt} foi aprovado e seu agendamento está confirmado! Até logo! 🌸`,
  });

  // Para a profissional
  if (profEmail) {
    await emailjs.send(EJS_SERVICE_ID, TPL_PROFESSIONAL, {
      to_email:     profEmail,
      prof_name:    getProfName(booking.professionalId),
      client_name:  booking.clientName,
      client_phone: booking.clientPhone,
      client_email: booking.clientEmail,
      service_name: getServiceName(booking.serviceId),
      date:         formatDate(booking.date),
      time:         booking.time,
      notes:        booking.notes || 'Nenhuma observação',
      booking_id:   `#${booking.id.slice(-6).toUpperCase()}`,
      status:       `✅ PAGAMENTO CONFIRMADO — ${amountFmt}`,
    });
  }
}
