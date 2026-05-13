import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Health Tracking",
  description: "Personal health dashboard with medication tracking and expert-backed recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-bg text-text">
        <Nav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <Disclaimer />
      </body>
    </html>
  );
}
