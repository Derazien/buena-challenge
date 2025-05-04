import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";
import NotificationContainer from "@/components/notifications/NotificationContainer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buena",
  description: "A powerful platform for property owners to manage and invest in their properties without middle-men.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <div className="container mx-auto h-full w-full max-w-screen-2xl p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <NotificationContainer />
        </Providers>
      </body>
    </html>
  );
}
