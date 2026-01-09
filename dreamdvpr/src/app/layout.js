import "./styles/globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "./components/providers/AuthProvider";
import { getContent } from "./lib/content.server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "../components/GoogleAnalytics";
export const metadata = {
  title: "REDGRAVITY | Premium Digital Solutions",
  description: "We build premium, high-performance digital experiences.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>

        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
