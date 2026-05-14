import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ServiceTitan | Premium Appliance Repair & Maintenance",
  description:
    "Book expert appliance repair technicians in minutes. Fast, reliable, and transparent pricing. ServiceTitan connects you with certified professionals for all your home appliance needs.",
  keywords: [
    "appliance repair",
    "home maintenance",
    "technician booking",
    "HVAC repair",
    "washer repair",
    "refrigerator repair",
  ],
  openGraph: {
    title: "ServiceTitan | Premium Appliance Repair & Maintenance",
    description:
      "Book expert appliance repair technicians in minutes. Fast, reliable, and transparent pricing.",
    type: "website",
    locale: "en_US",
    siteName: "ServiceTitan",
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
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
