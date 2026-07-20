import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Encuesta de satisfacción | 9FOURGYM",
  description: "Comparte tu opinión sobre tu experiencia en 9FOURGYM México.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
