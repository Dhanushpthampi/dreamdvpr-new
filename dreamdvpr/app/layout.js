import "./styles/globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "./components/AuthProvider";
import { getContent } from "./lib/getContent";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
export const metadata = {
  title: "DREAMdvpr | Premium Digital Solutions",
  description: "We build premium, high-performance digital experiences.",
};

export default async function RootLayout({ children }) {
  // Fetch content server-side and pass theme to client
  const content = await getContent();
  const theme = content?.theme || null;

  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {theme && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__THEME_DATA__ = ${JSON.stringify(theme)};`,
            }}
          />
        )}
        <AuthProvider>
          <Providers initialTheme={theme}>{children}</Providers>
        </AuthProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
