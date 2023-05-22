"use client";
import { LinkLibrary } from "@/utils/LinkLibrary";
import { HomeLayout, LinkingProvider } from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-styles";

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <LinkingProvider value={LinkLibrary}>
          <HomeLayout></HomeLayout>
        </LinkingProvider>
      </body>
    </html>
  );
}
