import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://trua-2026-katalog.boyrazcagan.chatgpt.site";
const title = "Trua | Mobilya Aksesuarları 2026 Kataloğu";
const description = "Trua dolap kulpları, çekmece kulpları ve mobilya aksesuarları 2026 ürün kataloğu.";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title,
  description,
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "tr_TR",
    images: [{ url: `${basePath}/og.png`, width: 1200, height: 630, alt: "Trua 2026 Koleksiyonu" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${basePath}/og.png`] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
