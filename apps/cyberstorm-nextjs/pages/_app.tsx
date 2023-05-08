import type { AppProps } from "next/app";
import "@thunderstore/cyberstorm-styles";
import { LinkingProvider } from "@/LinkingProvider";
import { LinkLibrary } from "@/LinkLibrary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LinkingProvider value={LinkLibrary}>
      <Component {...pageProps} />
    </LinkingProvider>
  );
}
