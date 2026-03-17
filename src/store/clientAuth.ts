import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface ClientProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  manutencao: number;
  notes?: string;
  birthdate?: string;
}

interface ClientAuthStore {
  user: { id: string; email: string } | null;
  profile: ClientProfile | null;
  loading: boolean;
  authLoading: boolean;
  error: string;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, name: string, phone: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<ClientProfile>) => Promise<void>;
  fetchProfile: (email: string) => Promise<void>;
}

export const useClientAuthStore = create<ClientAuthStore>()((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  authLoading: true,
  error: '',

  init: async () => {
    set({ authLoading: true });
    const { data } = await supabase.auth.getSession();
    const u = data.session?.user;
    if (u) {
      set({ user: { id: u.id, email: u.email ?? '' } });
      await get().fetchProfile(u.email ?? '');
    }
    set({ authLoading: false });

    supabase.auth.onAuthStateChange(async (_e, session) => {
      const u2 = session?.user;
      if (u2) {
        set({ user: { id: u2.id, email: u2.email ?? '' } });
        await get().fetchProfile(u2.email ?? '');
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  fetchProfile: async (email) => {
    set({ loading: true });
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();
    set({ profile: data as ClientProfile ?? null, loading: false });
  },

  login: async (email, password) => {
    set({ error: '' });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = error.message.includes('Invalid login')
        ? 'E-mail ou senha incorretos.'
        : error.message;
      set({ error: msg });
      return msg;
    }
    return null;
  },

  register: async (email, password, name, phone) => {
    set({ error: '' });
    const { error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
        emailRedirectTo: 'https://lumiestudio.com.br/confirmar',
      },
    });
    if (authErr) {
      set({ error: authErr.message });
      return authErr.message;
    }
    return null;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  updateProfile: async (data) => {
    const { profile } = get();
    if (!profile) return;
    await supabase.from('clients').update(data).eq('id', profile.id);
    set({ profile: { ...profile, ...data } });
  },
}));
