import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  applicationName: "AcreX",
  title: {
    default: "AcreX - Land, verified.",
    template: "%s - AcreX",
  },
  description:
    "Buy and sell land across Somalia. Every listing is reviewed with its title documents before going live.",
  icons: {
    icon: "/acrex-icon.svg",
    shortcut: "/acrex-icon.svg",
    apple: "/acrex-icon.svg",
  },
  openGraph: {
    title: "AcreX - Land, verified.",
    description:
      "Buy and sell land across Somalia. Every listing is reviewed with its title documents before going live.",
    siteName: "AcreX",
    images: ["/acrex-logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
