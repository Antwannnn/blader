import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import { Nav } from "@components/Components";
import { motion } from "framer-motion";
import Provider from "@components/Provider";
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
    <html lang="en" className="bg-primary_dark">

      <body className={` ${Exo2.className}`}>
        <Provider>
          <div>
            <Nav />
          </div>
          <main className="">
            {children}
          </main>
        </Provider>
      </body>


    </html>
  );
}
