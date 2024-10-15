// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import BottomNav from "@/components/BottomNav";
import MusicPlayerButton from "./audiobooks/(Components)/MusicPlayerButton";
import { MusicProvider } from "@/components/MusicContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Golpro",
  description: "Golpro",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <SessionProvider >
      <html lang="en">
        <head>
          <link
            rel="icon"
            href="./icon.svg"
            type="image/<generated>"
            sizes="<generated>"
          />
        </head>
        <body className={`${inter.className} sm:!pb-16`}>
          <Navbar />
          <MusicProvider>
            <MusicPlayerButton />
            {children}
          </MusicProvider>
          <Footer />
          <BottomNav />
        </body>
      </html>
    </SessionProvider>
  );
}
