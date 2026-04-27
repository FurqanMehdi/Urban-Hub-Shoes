import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Urban Hub Shoes | Premium Footwear",
  description: "Urban Hub Shoes - Your destination for premium, stylish, and comfortable footwear. Shop the latest trends in running, casual, and formal shoes.",
  keywords: "shoes, sneakers, footwear, running shoes, casual shoes, urban hub",
  openGraph: {
    title: "Urban Hub Shoes",
    description: "Premium Footwear for Every Step",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
