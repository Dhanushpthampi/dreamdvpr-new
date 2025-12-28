import './styles/globals.css';
import { Providers } from './providers';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from './components/AuthProvider';
import { getContent } from './lib/getContent';

export const metadata = {
  title: 'DREAMdvpr | Premium Web, Mobile & AI Solutions',
  description: 'We build premium, high-performance digital experiences.',
};

export default async function RootLayout({ children }) {
  // Fetch content server-side and pass theme to client
  const content = await getContent();
  const theme = content?.theme || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        {theme && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__THEME_DATA__ = ${JSON.stringify(theme)};`,
            }}
          />
        )}
        <AuthProvider>
          <Providers initialTheme={theme}>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
