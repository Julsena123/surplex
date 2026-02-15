import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-7xl gap-4 p-4 text-sm font-medium">
            <Link href="/">Vehicles</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/reminders">Reminders</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl p-4">{children}</main>
      </body>
    </html>
  );
}
