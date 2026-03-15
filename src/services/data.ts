import type { Service, Professional } from '../models';

export const SERVICES: Service[] = [
  {
    id: 'skincare',
    name: 'Skincare & Facial',
    description: 'Limpeza profunda, hidratação, peeling e tratamentos anti-aging com produtos de alta performance.',
    duration: 60,
    price: 180,
    icon: '✦',
    category: 'Rosto',
  },
  {
    id: 'manicure',
    name: 'Manicure & Nail Art',
    description: 'Manicure, pedicure, esmaltação em gel e nail art exclusiva para quem busca requinte nos detalhes.',
    duration: 75,
    price: 120,
    icon: '💅',
    category: 'Unhas',
  },
  {
    id: 'sobrancelhas',
    name: 'Design de Sobrancelhas',
    description: 'Henna, micropigmentação e brow lamination para o olhar perfeito que emoldura toda a sua beleza.',
    duration: 45,
    price: 90,
    icon: '🌸',
    category: 'Olhar',
  },
  {
    id: 'spa',
    name: 'Spa & Relaxamento',
    description: 'Massagens faciais, rituais de aromaterapia e tratamentos express para renovar sua energia.',
    duration: 90,
    price: 220,
    icon: '🕯️',
    category: 'Corpo',
  },
  {
    id: 'consultoria',
    name: 'Consultoria de Beleza',
    description: 'Análise de coloração pessoal, rotina de skincare e orientação de estilo para o seu biotipo.',
    duration: 60,
    price: 150,
    icon: '💛',
    category: 'Estilo',
  },
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 'prof-1',
    name: 'Ana Luiza',
    role: 'Especialista em Skincare',
    avatar: 'AL',
    services: ['skincare', 'spa', 'consultoria'],
    availableDays: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'prof-2',
    name: 'Camila Reis',
    role: 'Nail Designer',
    avatar: 'CR',
    services: ['manicure'],
    availableDays: [1, 2, 3, 4, 5],
  },
  {
    id: 'prof-3',
    name: 'Fernanda Costa',
    role: 'Especialista em Sobrancelhas',
    avatar: 'FC',
    services: ['sobrancelhas', 'consultoria'],
    availableDays: [2, 3, 4, 5, 6],
  },
  {
    id: 'prof-4',
    name: 'Beatriz Lemos',
    role: 'Terapeuta & Esteticista',
    avatar: 'BL',
    services: ['spa', 'skincare'],
    availableDays: [1, 3, 4, 5, 6],
  },
];

export const TIME_SLOTS = [
  '09:00', '09:45', '10:30', '11:15',
  '13:00', '13:45', '14:30', '15:15',
  '16:00', '16:45', '17:30', '18:15',
];

export const ADMIN_CREDENTIALS = {
  username: 'admin@lumie.com.br',
  password: 'lumie2025',
};
