import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Future Proofing", template: "%s · Future Proofing" },
  description: "A hands-on course on using AI well: read a short page, then solve a puzzle with a real model.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <Link href="/" className="brand">Future Proofing</Link>
          <span className="tag">Learn to work with AI</span>
        </header>
        <main>{children}</main>
        <footer className="site">Free for individuals. Progress is saved on this device only.</footer>
      </body>
    </html>
  );
}
