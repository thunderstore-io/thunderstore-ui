import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";

const SertraApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default SertraApp;
