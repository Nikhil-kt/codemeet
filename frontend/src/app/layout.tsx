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
      <body className="flex flex-col min-h-screen bg-[#FFF3E8] text-[#431407] antialiased selection:bg-[#F97316] selection:text-white overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <footer className="bg-white border-t border-[#FED7AA] py-8 mt-auto text-[#78716C]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
                <span className="font-semibold text-[#7C2D12]">ImpactLink Platform</span>
                <span>•</span>
                <span className="text-[#9A3412] font-medium">100% Free Public Civic Initiatives</span>
              </div>
              <div className="text-[#78716C] text-center sm:text-right">
                © {new Date().getFullYear()} ImpactLink Platform. Built for verified community impact, transparency, and accountability.
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
