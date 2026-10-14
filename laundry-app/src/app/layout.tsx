import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'LaundryKu - Sistem Manajemen Operasional & Prediksi Stok Laundry',
  description:
    'Aplikasi manajemen laundry berbasis web dengan pelacakan operasional, cash flow, laporan, dan prediksi stok bahan baku Machine Learning.',
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
