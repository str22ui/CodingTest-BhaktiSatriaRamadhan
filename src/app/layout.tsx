import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aplikasi Manajemen Cuti',
  description: 'Aplikasi untuk mengelola data cuti pegawai',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}