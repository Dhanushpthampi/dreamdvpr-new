import "./styles/globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "./components/providers/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "../components/GoogleAnalytics";

export const metadata = {
  title: "REDGRAVITY | Premium Digital Solutions",
  description: "We build premium, high-performance digital experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
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
