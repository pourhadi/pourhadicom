import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jbm = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "dan-4 — a Daniel Pourhadi foundation model",
  description:
    "dan-4: a Daniel Pourhadi foundation model. Architecture, technical leadership, and AI agents built from the ground up.",
  other: {
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jbm.variable}`}>
      <body>{children}</body>
    </html>
  );
}
