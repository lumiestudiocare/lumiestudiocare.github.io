import { useState, useMemo, useCallback } from 'react';
import { format, addDays, isBefore, startOfDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { BookingFormData, ServiceId } from '../models';
import { PROFESSIONALS, SERVICES, TIME_SLOTS } from '../services/data';
import { useBookingStore } from '../store';

// ── BOOKING VIEW MODEL ────────────────────────────────────────────
export function useBookingViewModel() {
  const { addBooking, getBookedTimes, bookings } = useBookingStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<BookingFormData>({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: '',
    professionalId: '',
    date: '',
    time: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Professionals filtered by selected service
  const availableProfessionals = useMemo(() => {
    if (!form.serviceId) return PROFESSIONALS;
    return PROFESSIONALS.filter(p => p.services.includes(form.serviceId as ServiceId));
  }, [form.serviceId]);

  // Calendar: next 30 days, skip Sundays and past days
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    for (let i = 0; i < 35; i++) {
      const d = addDays(today, i);
      if (d.getDay() !== 0) dates.push(d); // skip Sunday
    }
    return dates;
  }, []);

  // Time slots filtered by availability
  const availableSlots = useMemo(() => {
    if (!form.date || !form.professionalId) return TIME_SLOTS.map(t => ({ time: t, available: true }));
    const booked = getBookedTimes(form.date, form.professionalId);
    const now = new Date();
    return TIME_SLOTS.map(t => {
      if (booked.includes(t)) return { time: t, available: false };
      if (form.date === format(now, 'yyyy-MM-dd')) {
        const [h, m] = t.split(':').map(Number);
        const slotDate = new Date(); slotDate.setHours(h, m);
        if (isBefore(slotDate, now)) return { time: t, available: false };
      }
      return { time: t, available: true };
    });
  }, [form.date, form.professionalId, getBookedTimes, bookings]);

  const selectedService = useMemo(() =>
    SERVICES.find(s => s.id === form.serviceId), [form.serviceId]);

  const selectedProfessional = useMemo(() =>
    PROFESSIONALS.find(p => p.id === form.professionalId), [form.professionalId]);

  const updateForm = useCallback((field: keyof BookingFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Reset downstream fields
    if (field === 'serviceId') setForm(prev => ({ ...prev, serviceId: value as ServiceId, professionalId: '', date: '', time: '' }));
    if (field === 'professionalId') setForm(prev => ({ ...prev, professionalId: value, date: '', time: '' }));
    if (field === 'date') setForm(prev => ({ ...prev, date: value, time: '' }));
  }, []);

  const validateStep = useCallback((s: number): boolean => {
    const errs: Partial<Record<keyof BookingFormData, string>> = {};
    if (s === 1) {
      if (!form.serviceId) errs.serviceId = 'Selecione um serviço';
      if (!form.professionalId) errs.professionalId = 'Selecione uma profissional';
    }
    if (s === 2) {
      if (!form.date) errs.date = 'Selecione uma data';
      if (!form.time) errs.time = 'Selecione um horário';
    }
    if (s === 3) {
      if (!form.clientName.trim()) errs.clientName = 'Nome obrigatório';
      if (!form.clientPhone.trim()) errs.clientPhone = 'Telefone obrigatório';
      if (!form.clientEmail.trim()) errs.clientEmail = 'E-mail obrigatório';
      if (form.clientEmail && !/\S+@\S+\.\S+/.test(form.clientEmail)) errs.clientEmail = 'E-mail inválido';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const nextStep = useCallback(() => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 4) as 1|2|3|4);
  }, [step, validateStep]);

  const prevStep = useCallback(() =>
    setStep(s => Math.max(s - 1, 1) as 1|2|3|4), []);

  const submit = useCallback(() => {
    if (!validateStep(3)) return;
    const booking = addBooking({
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      clientEmail: form.clientEmail,
      serviceId: form.serviceId as ServiceId,
      professionalId: form.professionalId,
      date: form.date,
      time: form.time,
      notes: form.notes,
      status: 'pending',
    });
    setSubmittedId(booking.id);
    setStep(4);
  }, [form, addBooking, validateStep]);

  const reset = useCallback(() => {
    setForm({ clientName:'', clientPhone:'', clientEmail:'', serviceId:'', professionalId:'', date:'', time:'', notes:'' });
    setStep(1);
    setSubmittedId(null);
    setErrors({});
  }, []);

  const formatDate = (d: string) => {
    if (!d) return '';
    const [y,m,day] = d.split('-').map(Number);
    return format(new Date(y, m-1, day), "d 'de' MMMM", { locale: ptBR });
  };

  return {
    step, form, errors, submittedId,
    availableProfessionals, availableDates, availableSlots,
    selectedService, selectedProfessional,
    updateForm, nextStep, prevStep, submit, reset, formatDate,
    isToday,
  };
}

// ── ADMIN VIEW MODEL ──────────────────────────────────────────────
export function useAdminViewModel() {
  const { bookings, updateStatus, deleteBooking } = useBookingStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo(() => {
    return bookings
      .filter(b => filterStatus === 'all' || b.status === filterStatus)
      .filter(b => !filterDate || b.date === filterDate)
      .filter(b => !search || b.clientName.toLowerCase().includes(search.toLowerCase()) || b.clientPhone.includes(search))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [bookings, filterStatus, filterDate, search]);

  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const thisMonth = format(new Date(), 'yyyy-MM');
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmedToday: bookings.filter(b => b.date === today && b.status === 'confirmed').length,
      completedMonth: bookings.filter(b => b.createdAt.startsWith(thisMonth) && b.status === 'completed').length,
    };
  }, [bookings]);

  const getServiceName = (id: string) => SERVICES.find(s => s.id === id)?.name ?? id;
  const getProfName = (id: string) => PROFESSIONALS.find(p => p.id === id)?.name ?? id;

  const formatDate = (d: string) => {
    if (!d) return '';
    const [y,m,day] = d.split('-').map(Number);
    return format(new Date(y, m-1, day), "dd/MM/yyyy");
  };

  return {
    filtered, stats,
    filterStatus, setFilterStatus,
    filterDate, setFilterDate,
    search, setSearch,
    updateStatus, deleteBooking,
    getServiceName, getProfName, formatDate,
  };
}
