// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ReduxProvider } from "./components/providers/ReduxProvider";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import "./globals.css";
import Script from "next/script";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kurate — Premium Tech Marketplace",
  description:
    "Discover curated gadgets from trusted local vendors. Phones, laptops, monitors, and desk accessories — all in one place.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Kurate — Premium Tech Marketplace",
    description:
      "Browse a handpicked selection of tech. Clean, fast, and straight to the seller.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Theme script – runs before React to prevent flash */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`(function(){
            try {
              const t = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', t);
              if (t === 'dark') document.documentElement.classList.add('dark');
            } catch (e) {}
          })()`}
        </Script>

        <ReduxProvider>
          <ThemeProvider defaultTheme="dark">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Analytics />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}