import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Securelytix | Full-Stack Data Vaulting Platform",
  description: "Enterprise data discovery and classification platform for secure data management",
  keywords: ["data discovery", "data classification", "security", "compliance", "AI"],
  authors: [{ name: "Securelytix" }],
  icons: {
    icon: "/securelytixFavicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/securelytixFavicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
