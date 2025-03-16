import type { Metadata } from "next";
import { Baloo_Da_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ThemeProvider from "./context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bd = Baloo_Da_2({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Golpro",
  description: "Golpro",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="./assets/icons/icon.svg"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className={`${bd.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
