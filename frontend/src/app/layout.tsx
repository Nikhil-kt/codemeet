import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ImpactLink | AI-Powered Community Coordination & Volunteer Management',
  description: 'Connecting genuine organizations with suitable volunteers through AI matching, verified trust scoring, QR attendance, and automated campaign tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} ImpactLink Platform. Built for verified community impact, transparency, and accountability.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

