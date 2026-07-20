// ── Mercado Pago — Checkout Bricks (client-side) ──────────────────
// Documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks
//
// SETUP:
//   1. Crie conta em mercadopago.com.br
//   2. Acesse: Seu negócio > Credenciais
//   3. Copie sua PUBLIC KEY (começa com APP_USR- ou TEST-)
//   4. Adicione no .env: VITE_MP_PUBLIC_KEY=sua_chave_aqui
//
// IMPORTANTE: Para processar pagamentos reais você precisará de um
// backend (ex: Vercel Edge Function, Supabase Function ou Node.js)
// para criar a preferência de pagamento via API server-side.
// Esta implementação usa Checkout Pro (redirect) que não precisa de backend.

export interface PaymentItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: 'BRL';
}

export interface MPPreference {
  bookingId: string;
  items: PaymentItem[];
  payer: {
    name: string;
    email: string;
    phone: string;
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: 'approved' | 'all';
  external_reference: string;
  notification_url?: string;
}

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY ?? 'TEST-your-public-key';

// ── Cria URL de checkout via API do MP ────────────────────────────
// Nota: Em produção, mova isso para um endpoint backend seguro.
// A SECRET_KEY nunca deve ficar exposta no client.
export async function createMPCheckout(pref: MPPreference): Promise<string> {
  // Simulação client-side: redireciona para o Checkout Pro via SDK
  // Em produção substitua pela chamada ao seu backend:
  // const res = await fetch('/api/create-preference', { method: 'POST', body: JSON.stringify(pref) });
  // const { init_point } = await res.json();
  // return init_point;

  // Por ora retornamos a URL de sandbox para demonstração
  const params = new URLSearchParams({
    preference_id: `DEMO_${pref.bookingId}`,
    public_key: MP_PUBLIC_KEY,
    external_reference: pref.external_reference,
  });
  return `https://www.mercadopago.com.br/checkout/v1/redirect?${params.toString()}`;
}

// ── Extrai status do pagamento da URL (retorno do MP) ─────────────
export type MPStatus = 'approved' | 'pending' | 'failure' | null;

export function getMPStatusFromURL(): { status: MPStatus; bookingId: string | null } {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status') as MPStatus;
  const ref    = params.get('external_reference');
  return { status, bookingId: ref };
}

// ── Formata preço para exibição ───────────────────────────────────
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// ── InfinitePay — Checkout Integrado (client-side, sem backend) ───
// Documentação: https://ajuda.infinitepay.io/pt-BR/articles/10766888
//
// Como funciona pro Lumiê Studio:
//   Cada profissional tem sua própria conta InfinitePay (handle / InfiniteTag).
//   O link de pagamento é criado usando o handle da profissional que atende
//   o serviço agendado — o valor cai 100% direto na conta dela, sem passar
//   pelo Lumiê. Não existe "split" nativo na API da InfinitePay: a forma de
//   conseguir isso é gerar o link certo pro handle certo.
//
// Essa API não exige chave secreta pra criar o link nem pra consultar o
// pagamento — os dois endpoints são seguros de chamar direto do navegador.

const INFINITEPAY_LINKS_URL = 'https://api.checkout.infinitepay.io/links';
const INFINITEPAY_CHECK_URL = 'https://api.checkout.infinitepay.io/payment_check';

export interface InfinitePayItem {
  quantity: number;
  price: number; // em CENTAVOS — R$ 10,00 = 1000
  description: string;
}

export interface CreateInfinitePayLinkParams {
  handle: string;        // InfiniteTag da profissional (sem o "$")
  orderNsu: string;      // usamos o id do booking
  redirectUrl: string;
  items: InfinitePayItem[];
  customer?: { name: string; email: string; phone_number: string };
}

export async function createInfinitePayCheckout(params: CreateInfinitePayLinkParams): Promise<string> {
  const res = await fetch(INFINITEPAY_LINKS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      handle: params.handle,
      redirect_url: params.redirectUrl,
      order_nsu: params.orderNsu,
      items: params.items,
      ...(params.customer ? { customer: params.customer } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`Não foi possível gerar o link de pagamento InfinitePay (HTTP ${res.status})`);
  }
  const data = await res.json();
  if (!data?.url) throw new Error('Resposta inesperada da InfinitePay ao criar o link de pagamento');
  return data.url as string;
}

// ── Lê os parâmetros que a InfinitePay anexa na redirect_url ──────
export interface InfinitePayReturn {
  orderNsu: string | null;
  captureMethod: 'credit_card' | 'pix' | null;
  transactionNsu: string | null;
  slug: string | null;
  receiptUrl: string | null;
}

export function getInfinitePayReturnFromURL(): InfinitePayReturn {
  const params = new URLSearchParams(window.location.search);
  return {
    orderNsu:       params.get('order_nsu'),
    captureMethod:  params.get('capture_method') as InfinitePayReturn['captureMethod'],
    transactionNsu: params.get('transaction_nsu'),
    slug:           params.get('slug'),
    receiptUrl:     params.get('receipt_url'),
  };
}

// ── Confirma se o pagamento foi mesmo aprovado (sem depender de webhook) ──
export interface InfinitePayCheckResult {
  success: boolean;
  paid: boolean;
  amount?: number;      // centavos
  paid_amount?: number; // centavos
  installments?: number;
  capture_method?: string;
}

export async function checkInfinitePayPayment(params: {
  handle: string;
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}): Promise<InfinitePayCheckResult> {
  try {
    const res = await fetch(INFINITEPAY_CHECK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: params.handle,
        order_nsu: params.orderNsu,
        transaction_nsu: params.transactionNsu,
        slug: params.slug,
      }),
    });
    if (!res.ok) return { success: false, paid: false };
    return await res.json();
  } catch {
    return { success: false, paid: false };
  }
}

// ── Taxa de serviço online ─────────────────────────────────────────
// Cobrada em cima do valor do serviço, paga pela cliente, e repassada
// depois pela profissional para quem mantém o site (fora do fluxo
// automático — a InfinitePay não faz split nativo entre contas).
export const PLATFORM_FEE_RATE = 0.10; // 10%

export function calculateInfinitePayTotal(servicePrice: number) {
  const feeAmount   = Math.round(servicePrice * PLATFORM_FEE_RATE * 100) / 100;
  const totalAmount = Math.round((servicePrice + feeAmount) * 100) / 100;
  return { servicePrice, feeAmount, totalAmount };
}

// ── Preço em reais (Service.price) → centavos, como a InfinitePay espera ──
export function toCents(reais: number): number {
  return Math.round(reais * 100);
}

