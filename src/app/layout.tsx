import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const montserratArabic = localFont({
  src: "../../public/Montserrat-Arabic-Regular.ttf",
  variable: "--font-montserrat-arabic",
});

export const metadata: Metadata = {
  title: "Aufus Academy | Admin Dashboard",
  description: "Advanced administrative dashboard for Aufus Academy",
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${montserratArabic.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-montserrat-arabic)]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
