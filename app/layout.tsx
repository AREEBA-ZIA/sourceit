import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "SourceIt",
  description: "Request Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#EEEBDA] text-[#2B2B4A]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}