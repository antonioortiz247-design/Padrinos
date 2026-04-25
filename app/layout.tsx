import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { FloatingCart } from '@/components/FloatingCart';

const blackrush = localFont({ src: '../Blackrush.ttf', display: 'swap', variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Los Padrinos – Mar y Tierra - Tacos de mar y tierra al siguiente nivel',
  description: 'Los Padrinos – Mar y Tierra. Tacos de mar y tierra al siguiente nivel. Pedidos en línea, personalización y delivery directo a tu puerta.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Los Padrinos – Mar y Tierra',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${blackrush.variable} h-full`}>
      <body className="h-full bg-[var(--bg)] text-[var(--text)] antialiased">
        {children}
        <FloatingCart />
      </body>
    </html>
  );
}
