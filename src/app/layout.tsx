import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fredoka, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 3 focused fonts instead of 7
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://kihumba.com'),
  title: {
    default: "Kihumba | The Chaos Toolkit",
    template: "%s | Kihumba",
  },
  description: "Digital tools for modern chaos. Create funny traps, anonymous confession walls, polls, and more.",
  keywords: ["trap", "prank", "chaos", "decisions", "confession", "poll", "quiz", "anonymous", "fun"],
  authors: [{ name: "Kihumba Team" }],
  creator: "Kihumba",
  publisher: "Kihumba",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Kihumba | The Chaos Toolkit",
    description: "Digital tools for modern chaos. Create funny traps, anonymous confession walls, polls, and more.",
    url: 'https://kihumba.com',
    siteName: 'Kihumba',
    images: [
      {
        url: '/og-image.png', // Add this image to public folder!
        width: 1200,
        height: 630,
        alt: 'Kihumba Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kihumba | The Chaos Toolkit",
    description: "Digital tools for modern chaos. Create funny traps, anonymous confession walls, polls, and more.",
    creator: '@kihumba', // Replace with actual handle
    images: ['/twitter-image.png'], // Add this image to public folder!
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Optional: prevent zoom on inputs, useful for apps
};

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { CookieConsent } from "@/components/layout/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${fredoka.variable} ${jetbrains.variable} antialiased font-sans bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            {children}
            <CookieConsent />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
