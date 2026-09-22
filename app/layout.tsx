import type { Metadata } from "next";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = { 
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "ADPoly CyberGuard | Cybersecurity & AI Team",
    template: "%s | ADPoly CyberGuard",
  },
  description: site.description, verification: {
    google: "bNSKDy_iy8sB39kM_0humsSXuNlHoV1hiiE28aRX6sg",
  },
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title: "ADPoly CyberGuard | Cybersecurity & AI Team",
    description: site.description, 
    siteName: site.name,
    type: "website",
    locale: "en_AE",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/opengraph-image"],
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
