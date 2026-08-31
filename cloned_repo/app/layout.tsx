import type { Metadata } from "next";
import { DM_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Spotlight from "@/components/Spotlight";
import ParticleBackground from "@/components/ParticleBackground";
import ThemeToggle from "@/components/ThemeToggle";
import BootScreen from "@/components/BootScreen";

const geist = Inter({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["300", "400", "500"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sreejit Pradhan — Beginner Programmer & CP Learner",
  description:
    "Sreejit Pradhan, 16-y/o self-taught programmer from India. Learning Python & C++ for competitive programming.",
  authors: [{ name: "Sreejit Pradhan" }],
  metadataBase: new URL("https://sreejitdev.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sreejit Pradhan — Beginner Programmer & CP Learner",
    description:
      "16-y/o self-taught programmer from India. Learning Python & C++ for competitive programming.",
    type: "website",
    url: "https://sreejitdev.vercel.app/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sreejit Pradhan Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@SreejitX",
    title: "Sreejit Pradhan — Beginner Programmer & CP Learner",
    description:
      "16-y/o self-taught programmer from India. Learning Python & C++ for competitive programming.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://sreejitdev.vercel.app/#person",
                  "name": "Sreejit Pradhan",
                  "url": "https://sreejitdev.vercel.app/",
                  "jobTitle": "Beginner Programmer",
                  "description":
                    "16-year-old self-taught programmer from India learning Python and C++ for competitive programming.",
                  "nationality": "IN",
                  "sameAs": [
                    "https://github.com/ogMaverick12",
                    "https://x.com/SreejitX",
                    "https://www.linkedin.com/in/sreejit-pradhan-b27b19401",
                    "https://dev.to/sreejit_",
                    "https://medium.com/@sreejit",
                  ],
                  "knowsAbout": [
                    "Python",
                    "C++",
                    "Competitive Programming",
                    "Algorithms",
                    "Logic",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://sreejitdev.vercel.app/#website",
                  "url": "https://sreejitdev.vercel.app/",
                  "name": "Sreejit Pradhan — Portfolio",
                  "description":
                    "Personal portfolio of Sreejit Pradhan, beginner programmer learning Python and C++.",
                  "author": { "@id": "https://sreejitdev.vercel.app/#person" },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geist.variable} ${dmMono.variable} ${instrumentSerif.variable} font-sans antialiased bg-bg text-text select-none md:select-auto`}
      >
        <div className="grain-overlay" />
        <BootScreen />
        <ParticleBackground />
        <Spotlight />
        <SmoothScroll>{children}</SmoothScroll>
        <ThemeToggle />
      </body>
    </html>
  );
}
