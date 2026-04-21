import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/Toast";
import { TransitionProvider } from "@/components/TransitionProvider";

export const metadata: Metadata = {
  title: "GOLF LOTTO | Play. Track. Give.",
  description: "The ultimate golf score tracker and monthly prize draw platform supporting charities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-20">
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <TransitionProvider>
              {children}
            </TransitionProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
