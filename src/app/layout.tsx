import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Way - Build AI Chatbots for Free',
  description: 'Create intelligent chatbots trained on your data. Free tier, no credit card required.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
