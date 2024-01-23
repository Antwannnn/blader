import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import { Nav } from "@components/Components";
import "@styles/globals.css";

const Exo2 = Exo_2({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "blader. | Typing Speed Test",
  description: "Discover blader, the ultimate type tester.",
  icons: {
    icon: [
      {
        url: "/assets/images/logo.png",
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
      <body className={`${Exo2.className}`}>
        <div>
          <Nav />
        </div>
        <main className="min-h-screen items-center bg-primary_dark w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
