import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ImpactLink | Mobilize Verified Volunteers with Uncompromising Trust',
  description:
    'Connecting genuine organizations with suitable volunteers through multi-factor AI matching, verified trust scoring, cryptographic QR attendance, and automated campaign tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-[#FFF4E8] text-[#431407] antialiased selection:bg-[#FF6B1A] selection:text-white overflow-x-hidden font-body">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
