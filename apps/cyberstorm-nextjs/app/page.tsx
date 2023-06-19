"use client";
import { LinkLibrary } from "@/utils/LinkLibrary";
import {
  CyberstormProviders,
  HomeLayout,
  LinkingProvider,
} from "@thunderstore/cyberstorm";
import "@thunderstore/cyberstorm-styles";

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <LinkingProvider value={LinkLibrary}>
          <CyberstormProviders>
            <HomeLayout></HomeLayout>
          </CyberstormProviders>
        </LinkingProvider>
      </body>
    </html>
  );
}
