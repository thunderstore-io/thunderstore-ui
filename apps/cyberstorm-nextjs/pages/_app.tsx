import type { AppProps } from "next/app";
import "@thunderstore/cyberstorm-styles";
import { LinkingProvider } from "@/../../packages/cyberstorm/src";
import { LinkLibrary } from "@/../../packages/cyberstorm/src/components/Links/LinkLibrary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LinkingProvider value={LinkLibrary}>
      <Component {...pageProps} />
    </LinkingProvider>
  );
}
