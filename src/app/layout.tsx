import type { Metadata } from "next";

import { Providers } from "~/app/providers/trpc";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sprint",
  description: "Standup async untuk tim kecil",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
