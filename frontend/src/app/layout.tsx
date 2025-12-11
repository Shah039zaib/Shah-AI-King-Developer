// layout.tsx — App root layout with Sidebar + Header
import "./globals.css";
import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export const metadata = {
  title: "Shopify WhatsApp AI - Admin",
  description: "Admin panel for WhatsApp + AI automation"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
