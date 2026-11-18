import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Royal Shine Jewellery",
    default: "Royal Shine Jewellery — Handcrafted Luxury Diamond & Gold Jewellery",
  },
  description:
    "Explore Royal Shine Jewellery: an exclusive catalogue of handcrafted 22K gold, certified natural diamonds, bridal polki, and 925 sterling silver heirlooms.",
  keywords: [
    "Royal Shine Jewellery",
    "Luxury Jewellery Mumbai",
    "22K Gold Jewellery",
    "Diamond Solitaire",
    "Bridal Polki Set",
    "Kundan Jewellery",
    "925 Sterling Silver",
  ],
  authors: [{ name: "Royal Shine Jewellery" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://royalshinejewellery.com",
    siteName: "Royal Shine Jewellery",
    title: "Royal Shine Jewellery — Timeless Luxury Jewellery",
    description: "Handcrafted 22K gold, certified diamonds, and bespoke bridal heirlooms.",
    images: [
      {
        url: "/images/Bridal-jewellery/royal-shine-bridal-jewellery-collection-hero.webp",
        width: 1200,
        height: 630,
        alt: "Royal Shine Luxury Jewellery",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
