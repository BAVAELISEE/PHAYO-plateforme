import "./globals.css";
import Header from "@/components/Header";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";

export const metadata = {
  title: "PHAYO — un site, tous les services",
  description: "Plateforme qui met en relation clients et acteurs : services, articles et bien plus.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <Marquee />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
