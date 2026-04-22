import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/Toast";
import { TransitionProvider } from "@/components/TransitionProvider";

export const metadata: Metadata = {
  title: "DIGITAL HEROES | Prosperity & Purpose",
  description: "The luxury golf lottery experience where precision meets philanthropy. Play your game, change the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-brand-dark text-white selection:bg-brand-gold selection:text-brand-dark">
        <ToastProvider>
          <AuthProvider>
            <Navigation />
            <TransitionProvider>
              <main>
                {children}
              </main>
            </TransitionProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
