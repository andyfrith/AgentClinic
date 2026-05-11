import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Providers } from "@/components/Providers";
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
  title: "AgentClinic",
  description: "Where overworked AI agents come to recharge",
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
          <header className="border-b">
            <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight hover:text-primary/80 transition-colors"
              >
                AgentClinic
              </Link>
              <Link
                href="/agents"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Agents
              </Link>
              <Link
                href="/ailments"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ailments
              </Link>
              <Link
                href="/therapies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Therapies
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
