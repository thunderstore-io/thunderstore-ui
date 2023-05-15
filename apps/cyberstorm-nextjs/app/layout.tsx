"use client";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { LinkLibrary } from "@/utils/LinkLibrary";
import "@thunderstore/cyberstorm-styles";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
      </body>
    </html>
  );
}
