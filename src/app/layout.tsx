import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';

export const metadata: Metadata = {
  title: 'Sunkey PaygEnergy — Clean Solar on Stellar',
  description:
    'Pay-As-You-Go solar and clean energy platform with OpenPAYGO hardware tokens and Stellar/Soroban contracts',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PaygEnergy',
  },
};

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-clean-500 selection:text-white">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
