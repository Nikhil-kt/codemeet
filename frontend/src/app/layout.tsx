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
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-[#09090b] text-stone-100 antialiased selection:bg-amber-500 selection:text-black">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-[#0c0a09] border-t border-stone-800/80 py-8 mt-auto text-stone-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="font-semibold text-stone-300">ImpactLink Platform</span>
                <span>•</span>
                <span className="text-amber-400/90 font-medium">100% Free Public Civic Initiatives</span>
              </div>
              <div className="text-stone-500 text-center sm:text-right">
                © {new Date().getFullYear()} ImpactLink Platform. Built for verified community impact, transparency, and accountability.
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
