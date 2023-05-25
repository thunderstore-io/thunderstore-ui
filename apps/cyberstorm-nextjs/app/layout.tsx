"use client";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-styles";
import { LinkLibrary } from "@/utils/LinkLibrary";
import Providers from "@/utils/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LinkingProvider value={LinkLibrary}>{children}</LinkingProvider>
        </Providers>
      </body>
    </html>
  );
}
