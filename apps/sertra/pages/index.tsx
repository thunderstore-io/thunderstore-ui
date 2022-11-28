import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { SWRConfig } from "swr";

import { ServerList } from "../components/ServerList";
import styles from "../components/ServerList.module.css";

export const getStaticProps: GetStaticProps = async () => {
  const fallback: { [key: string]: unknown } = {};

  // TODO: Re-enable once API is available
  // try {
  //   fallback[ApiURLs.ServerList] = await getServerListings();
  // } catch (e) {
  //   console.error(e);
  //   fallback[ApiURLs.ServerList] = {
  //     count: 0,
  //     next: null,
  //     previous: null,
  //     results: [],
  //   };
  // }

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
        </Head>
        <main className={styles.main}>
          <ServerList community={"v-rising"} />
        </main>
      </div>
    </SWRConfig>
  );
};

export default Home;
