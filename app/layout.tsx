import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { Nav } from "@components/Components";
import "@styles/globals.css";

const josefin = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "blade | Typing Speed Test",
  description: "Discover blade, the ultimate type tester.",
  icons: {
    icon: [
      {
        url: "/public/assets/images/logo.png",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={josefin.className}>
        <div>
          <Nav />
        </div>
        <main className="min-h-screen bg-primary_dark w-full p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
