import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playground — EEP',
  description: 'Validate EEP event envelopes and Standard Webhooks HMAC signatures in your browser.',
};

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
