import './styles/globals.css';
import { Providers } from './providers';
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata = {
  title: 'DREAMdvpr | Premium Web, Mobile & AI Solutions',
  description: 'We build premium, high-performance digital experiences.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
