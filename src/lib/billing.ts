import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia' as any,
});

export const PLANS = {
  FREE: {
    name: 'Free',
    chatbots: 1,
    pages: 30,
    queries: 100,
    tokens: 1_000_000,
  },
  STARTER: {
    name: 'Starter',
    chatbots: 2,
    pages: 200,
    queries: 500,
    tokens: 5_000_000,
    monthlyPrice: 5,
  },
  PRO: {
    name: 'Pro',
    chatbots: 10,
    pages: 2000,
    queries: 5000,
    tokens: 50_000_000,
    monthlyPrice: 19,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    chatbots: -1,
    pages: -1,
    queries: -1,
    tokens: -1,
    monthlyPrice: 49,
  },
} as const;

export function getPlanLimits(plan: keyof typeof PLANS) {
  return PLANS[plan];
}
