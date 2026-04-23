import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "BloomCRM - Property Dealer CRM",
  description: "A comprehensive CRM system for property dealers in Pakistan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
