import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zee Digital Empire | AI Cinematic Production & Creative Studio",
  description: "Zee Digital Empire is a next-generation creative studio producing AI-powered films, commercials, music videos, and digital storytelling. Future Cinema Starts Here.",
  keywords: [
    "Zee Digital Empire",
    "AI filmmaking",
    "cinematic production",
    "AI commercials",
    "music video production",
    "VFX",
    "AI photography",
    "digital content creation",
    "creative studio",
    "AI video production"
  ],
  authors: [{ name: "Zee Digital Empire" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Zee Digital Empire | AI Cinematic Production",
    description: "Engineering Cinematic Experiences with AI - Next-generation creative studio for AI-powered films, commercials, and digital storytelling.",
    url: "https://zedigitalempire.com",
    siteName: "Zee Digital Empire",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zee Digital Empire | AI Cinematic Production",
    description: "Engineering Cinematic Experiences with AI - Future Cinema Starts Here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
