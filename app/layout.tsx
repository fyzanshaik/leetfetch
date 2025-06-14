// import { ReactScan } from "./components/ReactScan";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LeetFetch - LeetCode API Explorer",
  description:
    "Comprehensive LeetCode GraphQL API documentation with interactive code snippets in multiple programming languages",
  keywords: [
    "LeetCode",
    "API",
    "GraphQL",
    "Documentation",
    "Programming",
    "Coding",
  ],
  authors: [{ name: "Faizan Shaik", url: "https://github.com/fyzanshaik" }],
  creator: "Faizan Shaik",
  openGraph: {
    title: "CodeQuery - LeetCode API Explorer",
    description: "Interactive LeetCode API documentation with code snippets",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      {/* <ReactScan /> */}
      <body
        className={`${inter.className} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
