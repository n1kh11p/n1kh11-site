import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Nikhil Paruchuri — Software Engineer",
  description:
    "CS @ Maryland. SWE Intern @ Microsoft — tooling for Teams researchers. Previously LinkedIn, Capital One, Chipotle. Writing poetry on the side.",
  openGraph: {
    title: "Nikhil Paruchuri",
    description:
      "Software engineer interested in product, infra, and parallel systems. Writing poetry on the side.",
    type: "website",
    url: "https://n1kh11.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikhil Paruchuri",
    description: "Software engineer. Product + infra. Writing poetry on the side.",
  },
};

const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const theme = stored === 'dark' ? 'dark' : 'light';
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${orbitron.variable} atmosphere antialiased bg-background text-foreground grain`}
        suppressHydrationWarning
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
