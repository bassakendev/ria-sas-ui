import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RIA SaaS',
  description: 'Invoice & Client Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
