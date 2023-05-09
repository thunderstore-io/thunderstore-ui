import type { AppProps } from "next/app";
import "@thunderstore/cyberstorm-styles";
import { LinkingProvider } from "@thunderstore/cyberstorm";
import { LinkLibrary } from "@/utils/LinkLibrary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LinkingProvider value={LinkLibrary}>
      <Component {...pageProps} />
    </LinkingProvider>
  );
}
