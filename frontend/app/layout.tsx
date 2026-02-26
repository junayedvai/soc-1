import type { Metadata } from 'next';
import './globals.css';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'AegisX - Enterprise SOC Platform',
  description: 'Advanced Security Operations Center Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-white antialiased font-sans">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
