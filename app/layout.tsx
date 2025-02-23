import SettingsModal from '@/components/modals/SettingsModal';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Nav } from "@components/Components";
import Provider from "@components/Provider";
import ThemeProvider from "@components/ThemeProvider";
import "@styles/globals.css";
import type { Metadata, ResolvingMetadata } from "next";
import { DM_Mono } from "next/font/google";
import { cookies } from 'next/headers';


const DM = DM_Mono({ subsets: ["latin"], fallback: ["monospace"], weight: "400", variable: "--font-dm" });

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value || 'light';
  const faviconUrl = `/api/favicon/${theme}`;
  
  return {
    title: "blader. | Typing Speed Test",
    description: "Discover blader, the ultimate type tester.",
    icons: {
      icon: [{ url: faviconUrl, type: 'image/svg+xml', sizes: 'any' }]
    }
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${DM.className}`}>
        <SettingsProvider>
          <Provider>
            <div>
              <Nav />
              <ThemeProvider />
            </div>
            <main>
              {children}
            </main>
            <SettingsModal />
          </Provider>
        </SettingsProvider>
      </body>
    </html>
  );
}
