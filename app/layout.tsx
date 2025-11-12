import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'What do you want? | Agentic Survey',
  description: 'Tell us what you want and why it matters',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
          <header className="border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-brand-600" />
                  <span className="text-lg font-semibold text-gray-900">DesignArena</span>
                </div>
                <a className="text-sm text-brand-700 hover:underline" href="/">What do you want?</a>
              </div>
            </div>
          </header>
          <main className="container py-10">{children}</main>
          <footer className="border-t border-gray-200 bg-white/70">
            <div className="container py-6 text-center text-sm text-gray-500">
              Built for the web. Deployed on Vercel.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
