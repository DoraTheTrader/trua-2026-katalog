import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "Trua | Mobilya Aksesuarları Kataloğu";
const description = "Trua dolap kulpları, çekmece kulpları ve mobilya aksesuarları ürün kataloğu.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "tr_TR",
  },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
