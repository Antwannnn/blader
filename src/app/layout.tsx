import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";

const josefin = Josefin_Sans({subsets: ['latin']});

export const metadata: Metadata = {
  icons: { 
    icon: [
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo-white.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
  title: "blader | Home",
  description: "Discover blader, the ultimate typing test game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={josefin.className}>{children}</body>
    </html>
  );
}
