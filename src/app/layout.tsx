import './globals.css';

export const metadata = {
  title: 'Buyer Leads',
  description: 'Buyer Lead Intake app (minimal scaffold)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>{children}</main>
      </body>
    </html>
  );
}
