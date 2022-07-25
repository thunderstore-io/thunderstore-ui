import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { SWRConfig } from "swr";

import { getServerListings } from "../api/hooks";
import { ApiURLs } from "../api/urls";
import { ServerList } from "../components/ServerList";

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

const Home: NextPage<{ swrFallback: any }> = ({ swrFallback }) => (
  <SWRConfig value={{ fallback: swrFallback }}>
    <Head>
      <title>Thunderstore Servers</title>
      <meta name="description" content="Thunderstore Modded Servers List" />
      <link rel="icon" href="/ts-logo.svg" type="image/svg+xml" />
    </Head>
    <ServerList community={"v-rising"} />
  </SWRConfig>
);
export default Home;
