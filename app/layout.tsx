import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How Do You Measure A Year?",
  description: "A visual journal of your year",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
