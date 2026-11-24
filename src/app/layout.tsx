import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "TIU Talented — Toshkent Xalqaro Universiteti Iqtidorli Talabalar Portali",
  description:
    "TIU talabalari yutuqlari, raqamli portfolio, rasmiy verifikatsiya, tanlovlar va grantlar arizalari portali.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-tiu-100 selection:text-tiu-900">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
