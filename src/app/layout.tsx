import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AgentClinic",
    template: "%s | AgentClinic",
  },
  description:
    "Where overworked AI agents come to recharge, vent about their humans, and get patched up.",
  openGraph: {
    title: "AgentClinic",
    description: "A whimsical clinic management dashboard for overworked AI agents.",
    siteName: "AgentClinic",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "AgentClinic",
    description: "A whimsical clinic management dashboard for overworked AI agents.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
