import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";

export const metadata = {
  title: "PHAYO — un site, tous les services",
  description: "Plateforme qui met en relation clients et acteurs : services, articles et bien plus.",
  // Vérification AdSense (alternative au script) : remplacez ca-pub-XXXXXXXXXXXXXXXX
  other: { "google-adsense-account": "ca-pub-9390966977716700" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Ce script est mis UNE SEULE FOIS ici : il s'applique à toutes les pages */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9390966977716700"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Header />
        <Marquee />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
