import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";
import { LoginModal } from "@/components/common";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "AURA - Premium Lifestyle & Fashion",
  description: "Discover a curated selection of essentials that blend architectural precision with contemporary ease. Experience the new standard of premium living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} light`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans pb-16 lg:pb-0">
        <ReactQueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomNav />
          <LoginModal />
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}


