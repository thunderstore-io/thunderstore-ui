import type { AppProps } from "next/app";
import "@thunderstore/cyberstorm-styles";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
