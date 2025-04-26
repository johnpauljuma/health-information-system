import './globals.css'; // Tailwind base styles
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Health Information System',
  description: 'Manage clients and health programs easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header */}
          <header className="bg-blue-700 text-white p-4 shadow-md">
            <h1 className="text-2xl font-bold">Health Information System</h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto p-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-200 text-center py-4">
            <p className="text-sm text-gray-600">&copy; 2025 HealthSys. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
