import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Trua | Mobilya Aksesuarları 2026 Kataloğu";
  const description = "Trua dolap kulpları, çekmece kulpları ve mobilya aksesuarları 2026 ürün kataloğu ve güncel fiyat listesi.";

  return {
    title,
    description,
    icons: { icon: "/favicon.svg" },
    openGraph: { title, description, type: "website", locale: "tr_TR", images: [{ url: new URL("/og.png", origin), width: 1200, height: 630, alt: "Trua 2026 Koleksiyonu" }] },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", origin)] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
