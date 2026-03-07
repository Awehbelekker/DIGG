import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import FontLoader from "@/components/FontLoader";
import { getSiteSettings } from "@/lib/site-settings";
import { googleFontsUrl, DEFAULT_HEADING_FONT, DEFAULT_BODY_FONT } from "@/lib/google-fonts";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const favicon = settings.favicon_url && String(settings.favicon_url).trim();
  const ogImage = settings.og_image_url && String(settings.og_image_url).trim();
  return {
    title: "DIGG Architecture Cape Town | Property That Pays",
    description: "Cape Town architecture team specialising in income-generating design — Airbnb units, secondary dwellings, rezoning and property investment.",
    ...(favicon && { icons: { icon: favicon } }),
    ...(ogImage && {
      openGraph: { images: [ogImage] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const headingFont = (settings.heading_font && String(settings.heading_font).trim()) || DEFAULT_HEADING_FONT;
  const bodyFont = (settings.body_font && String(settings.body_font).trim()) || DEFAULT_BODY_FONT;
  const useCustomFonts = headingFont !== DEFAULT_HEADING_FONT || bodyFont !== DEFAULT_BODY_FONT;
  const fontFamilies = useCustomFonts ? [headingFont, bodyFont].filter((a, i, arr) => arr.indexOf(a) === i) : [];
  const fontStyle =
    useCustomFonts
      ? {
          "--font-heading": `"${headingFont.replace(/"/g, '\\"')}", Georgia, serif`,
          "--font-body": `"${bodyFont.replace(/"/g, '\\"')}", system-ui, sans-serif`,
        } as React.CSSProperties
      : undefined;

  const logoUrl = (settings.logo_url && String(settings.logo_url).trim()) || '';
  const logoSize = (settings.logo_size as 'small' | 'medium' | 'large') || 'medium';
  const navbarLogoPosition = (settings.navbar_logo_position as 'left' | 'center') || 'left';
  const footerLogoPosition = (settings.footer_logo_position as 'left' | 'center') || 'left';

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased`}
        style={fontStyle}
      >
        {fontFamilies.length > 0 && (
          <FontLoader href={googleFontsUrl(fontFamilies)} />
        )}
        <Navbar
          logoUrl={logoUrl}
          logoSize={logoSize}
          logoPosition={navbarLogoPosition}
        />
        <main>{children}</main>
        <Footer
          logoUrl={logoUrl}
          logoSize={logoSize}
          logoPosition={footerLogoPosition}
        />
        <WhatsAppButton />
      </body>
    </html>
  );
}
