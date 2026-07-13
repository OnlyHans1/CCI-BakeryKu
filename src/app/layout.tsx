import type { Metadata } from "next";
import { Overpass_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const overpass = Overpass_Mono({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BakeryKu — Roti Segar Setiap Hari",
  description: "BakeryKu adalah toko roti online dengan berbagai pilihan roti fresh berkualitas premium, dikirim langsung ke pintu Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${overpass.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
