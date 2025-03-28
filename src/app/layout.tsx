import type { Metadata } from "next";
import { Baloo_Da_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ThemeProvider from "./context/ThemeContext";
import { MusicProvider } from "./context/MusicContext";
import MusicPlayerButton from "./audiobooks/(components)/MusicPlayerButton";
import { BookmarkProvider } from "./context/BookMarkContext";

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
  title: "Home | GolPro",
  verification: { google: "" },
  description: "GolPro is a platform for stories, audiobooks, podcasts, and more.",
  keywords: "GolPro, story, ebook, audiobooks, podcasts, music, entertainment",
  openGraph: {
    title: "GolPro",
    description: "GolPro is a platform for stories, audiobooks, podcasts, and more.",
    url: "https://golpro.vercel.app/",
    siteName: "GolPro",
    images: [
      {
        url: "/protikWOutBg.webp",
        width: 800,
        height: 800,
        alt: "Protik's Portfolio Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
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
          <MusicProvider>
            <Providers>
              <BookmarkProvider>
                <Navbar />
                {children}
                <MusicPlayerButton />
                <Footer />
              </BookmarkProvider>
            </Providers>
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
