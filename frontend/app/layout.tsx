import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Caveat, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Sorika - Créez votre site en quelques minutes",
  description: "Plateforme no-code pour créer votre site vitrine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${nunito.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
