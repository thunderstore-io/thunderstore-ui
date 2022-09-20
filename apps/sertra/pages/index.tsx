import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { SWRConfig } from "swr";

import { getServerListings } from "../api/hooks";
import { ApiURLs } from "../api/urls";
import { ServerList } from "../components/ServerList";
import styles from "../components/ServerList.module.css";

export const getStaticProps: GetStaticProps = async () => {
  const fallback: { [key: string]: unknown } = {};
  fallback[ApiURLs.ServerList] = await getServerListings();
  return {
    props: {
      swrFallback: fallback,
    },
    revalidate: 10,
  };
};

const Home: NextPage<{ swrFallback: { [key: string]: unknown } }> = ({
  swrFallback,
}) => {
  return (
    <SWRConfig value={{ fallback: swrFallback }}>
      <div className={styles.container}>
        <Head>
          <title>Thunderstore Servers</title>
          <meta name="description" content="Thunderstore Modded Servers List" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#000000" />
        </Head>

        <main className={styles.main}>
          <ServerList community={"v-rising"} />
        </main>
      </div>
    </SWRConfig>
  );
};

export default Home;
