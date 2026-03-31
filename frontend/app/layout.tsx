import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import FAB from "@/components/ui/FAB";
import EmergencyMode from "@/components/ui/EmergencyMode";
import { CaseProvider } from "@/context/CaseContext";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Chitragupta — India's Legal First-Response System",
  description: "AI-powered legal aid web app for every Indian citizen. Get instant clarity. Know your rights. Take action — in Hindi or English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-inter bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen flex flex-col antialiased`}>
        <CaseProvider>
          <Navbar />
          <main className="flex-1 flex flex-col relative overflow-x-hidden">
            {children}
          </main>
          <EmergencyMode />
          <FAB />
          <Footer />
        </CaseProvider>
      </body>
    </html>
  );
}
