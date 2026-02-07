import type { Metadata } from "next";
import { Dancing_Script, Great_Vibes, Playfair_Display, Quicksand, Plus_Jakarta_Sans, Fredoka, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-vibes" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Kihumba | The Love Toolkit",
  description: "Create a playful digital trap for your Valentine.",
};

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { CookieConsent } from "@/components/layout/CookieConsent";

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dancing.variable} ${greatVibes.variable} ${playfair.variable} ${quicksand.variable} ${jakarta.variable} ${fredoka.variable} ${jetbrains.variable} antialiased font-sans bg-background text-foreground`}
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
