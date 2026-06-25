import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import FontLoader from "@/components/FontLoader";
import Analytics from "@/components/Analytics";
import SuppressPlayAbortError from "@/components/SuppressPlayAbortError";
import { getSiteSettings, getBrandColorsFromSettings } from "@/lib/site-settings";
import { brandColorsToCssProperties } from "@/lib/brand-colors";
import BrandPreviewBanner from "@/components/BrandPreviewBanner";
import PageColourway from "@/components/public/PageColourway";
import { googleFontsUrl, DEFAULT_HEADING_FONT, DEFAULT_BODY_FONT } from "@/lib/google-fonts";
import { getNavLinks } from "@/lib/get-nav-links";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#152232', // overridden at runtime via brand settings when deployed
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const favicon = settings.favicon_url && String(settings.favicon_url).trim();
  const ogImage = settings.og_image_url && String(settings.og_image_url).trim();
  return {
    title: "DIGG | Property Development & Architecture | Cape Town",
    description: "A Cape Town property development and architecture practice. Development advisory, architectural design, investment property solutions, and principal agent services.",
    icons: {
      icon: favicon || '/favicon.ico',
      apple: '/favicon.ico',
    },
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
  const [settings, navLinks] = await Promise.all([getSiteSettings(), getNavLinks()]);
  const headingFont = (settings.heading_font && String(settings.heading_font).trim()) || DEFAULT_HEADING_FONT;
  const bodyFont = (settings.body_font && String(settings.body_font).trim()) || DEFAULT_BODY_FONT;
  const useCustomFonts = headingFont !== DEFAULT_HEADING_FONT || bodyFont !== DEFAULT_BODY_FONT;
  const fontFamilies = useCustomFonts ? [headingFont, bodyFont].filter((a, i, arr) => arr.indexOf(a) === i) : [];
  const fontStyle =
    useCustomFonts
      ? {
          "--font-heading": `"${headingFont.replace(/"/g, '\\"')}", system-ui, sans-serif`,
          "--font-body": `"${bodyFont.replace(/"/g, '\\"')}", system-ui, sans-serif`,
        } as React.CSSProperties
      : undefined;

  const logoUrl = (settings.logo_url && String(settings.logo_url).trim()) || '';
  const logoSize = (settings.logo_size as 'small' | 'medium' | 'large') || 'medium';
  const navbarLogoPosition = (settings.navbar_logo_position as 'left' | 'center') || 'left';
  const footerLogoPosition = (settings.footer_logo_position as 'left' | 'center') || 'left';
  const phone = (settings.phone && String(settings.phone).trim()) || '';
  const siteName = (settings.site_name && String(settings.site_name).trim()) || 'digg';
  const navCtaText = (settings.nav_cta_text && String(settings.nav_cta_text).trim()) || "Let's talk";
  const brandCss = brandColorsToCssProperties(getBrandColorsFromSettings(settings));
  const htmlStyle = {
    ...brandCss,
    ...(fontStyle ?? {}),
  } as React.CSSProperties & Record<string, string>;

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`} style={htmlStyle}>
      <body className="antialiased bg-[var(--color-bone)] text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-body)' }}>
        <BrandPreviewBanner />
        {fontFamilies.length > 0 && (
          <FontLoader href={googleFontsUrl(fontFamilies)} />
        )}
        <Navbar
          logoUrl={logoUrl}
          logoSize={logoSize}
          logoPosition={navbarLogoPosition}
          phoneNumber={phone}
          links={navLinks}
          siteName={siteName}
          navCtaText={navCtaText}
        />
        <PageColourway>
          <main id="main-content" tabIndex={-1}>{children}</main>
        </PageColourway>
        <Footer
          logoUrl={logoUrl}
          logoSize={logoSize}
          logoPosition={footerLogoPosition}
          links={navLinks}
          siteSettings={settings}
        />
        <WhatsAppButton siteSettings={settings} />
        <Analytics />
        <SuppressPlayAbortError />
      </body>
    </html>
  );
}
