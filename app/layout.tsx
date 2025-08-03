// import { ReactScan } from "./components/ReactScan";
import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import Footer from "./components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "LeetFetch - LeetCode API Explorer",
  description:
    "Explore LeetCode's GraphQL API with a modern, minimalistic interface. Interactive testing, code generation, and real-time data visualization.",
  keywords: [
    "LeetCode",
    "API",
    "GraphQL",
    "Documentation",
    "Programming",
    "Coding",
    "Developer Tools",
    "Code Generator",
  ],
  authors: [{ name: "Faizan Shaik", url: "https://github.com/fyzanshaik" }],
  creator: "Faizan Shaik",
  openGraph: {
    title: "LeetFetch - LeetCode API Explorer",
    description: "Interactive LeetCode GraphQL API explorer with modern design",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${montserrat.variable}`}>
      {/* <ReactScan /> */}
      <body
        className={`${montserrat.className} antialiased bg-background text-foreground`}
      >
        {children}
        <Footer />
        <Toaster />
      </body>
      <Analytics />
    </html>
  );
}
