import "../styles/globals.css";
import type { AppProps } from "next/app";
import { library } from "@fortawesome/fontawesome-svg-core";

import { faIceCream } from "@fortawesome/free-solid-svg-icons";

library.add(faIceCream);
import { Layout } from "../components/Layout";

const SertraApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default SertraApp;
