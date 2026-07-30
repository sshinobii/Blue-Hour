import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrivyClientProvider } from "@/context/privy-provider";
import { WalletProvider } from "@/context/WalletContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Bluehour - AI Travel Discovery on Robinhood Chain",
  description:
    "Where do you want to disappear to? The AI travel companion for web3 nomads. Share your mystery routes. Powered by Robinhood Chain.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#FBFAF3] text-[#15150F]`}>
        <PrivyClientProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </PrivyClientProvider>
      </body>
    </html>
  );
}
