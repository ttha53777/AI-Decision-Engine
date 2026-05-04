import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { AppHeader } from "@/components/AppHeader";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "AI Decision Engine",
  description:
    "Structured decision support: compare two options, set priorities, and explore weighted scores with clear rationale.",
  openGraph: {
    title: "AI Decision Engine",
    description: "Compare two choices with weighted scoring, tradeoffs, and scenario context."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
