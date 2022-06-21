import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ServerList } from "../components/ServerList";
import { getServerListings } from "../api/hooks";
import { ApiURLs } from "../api/urls";
import { SWRConfig } from "swr";

export const getStaticProps: GetStaticProps = async () => {
  const fallback: any = {};
  fallback[ApiURLs.ServerList] = await getServerListings();
  return {
    props: {
      swrFallback: fallback,
    },
    revalidate: 10,
  };
};

const Home: NextPage<{ swrFallback: any }> = ({ swrFallback }) => {
  return (
    <SWRConfig value={{ fallback: swrFallback }}>
      <div className={styles.container}>
        <Head>
          <title>Thunderstore Servers</title>
          <meta name="description" content="Thunderstore Modded Servers List" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <ServerList community={"v-rising"} />
        </main>
      </div>
    </SWRConfig>
  );
};

export default Home;
