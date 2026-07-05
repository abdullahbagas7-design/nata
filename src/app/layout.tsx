import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nata — Sistem Manajemen Undangan",
  description: "Sistem manajemen produksi undangan pernikahan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
