import type { Metadata } from "next";
import { Figtree, Geist_Mono, Instrument_Serif } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";
import { Providers } from "./providers";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Users & Posts",
  description: "Browse JSONPlaceholder users and their posts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full font-sans antialiased",
        figtree.variable,
        instrumentSerif.variable,
        geistMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
