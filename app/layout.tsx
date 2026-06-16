import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern Todo App",
  description: "A Next.js todo app with MongoDB, Server Actions, and advanced practice features.",
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
