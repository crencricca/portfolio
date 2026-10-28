import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { preferencesScript } from "./preferences";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://heycatie.vercel.app"),
  title: "Catie Rencricca Portfolio",
  description: "Developed using NextJS - 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The preferences script sets data attributes on <html> before hydration
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
