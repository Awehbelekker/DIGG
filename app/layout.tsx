import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export const metadata: Metadata = {
  title: "DIGG Architecture Cape Town | Property That Pays",
  description: "Cape Town architecture team specialising in income-generating design — Airbnb units, secondary dwellings, rezoning and property investment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
