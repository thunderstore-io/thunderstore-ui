import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

import { ServerListingDetailData, ServerListingData } from "../../api/models";
import { ApiURLs } from "../../api/urls";
import { ModCard } from "../../components/ModCard";
import { ServerInfo } from "../../components/ServerInfo";
import { ServerInstructions } from "../../components/ServerInstructions";
import styles from "../../styles/ServerDetail.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(ApiURLs.ServerList);
  const listings = await res.json();

  const paths = listings?.results.map((listing: ServerListingData) => ({
    params: { id: listing.id },
  }));

  return { paths, fallback: "blocking" };
};

type ServerListingStaticProps = { detail_listing?: ServerListingDetailData };
type ServerListingQueryProps = { id: string };

export const getStaticProps: GetStaticProps<
  ServerListingStaticProps,
  ServerListingQueryProps
> = async (context) => {
  // Params is never undefined thanks to NextJS guarantees as long as the file
  // is named appropriately.
  const listingId = context.params!.id;
  const res = await fetch(ApiURLs.ServerDetail(listingId));
  const data = await res.json();

  return {
    props: {
      detail_listing: data,
    },
    revalidate: 10,
  };
};

const ServerDetail: React.FC<{ detail_listing: ServerListingDetailData }> = ({
  detail_listing,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">Servers</Link>
        <span className={styles.separator}>&gt;</span>
        <span>V Rising</span>
      </div>

      <div className={styles.headerRow}>
        <h1 className={styles.listingTitle}>{detail_listing.name}</h1>
        <button className={styles.joinServerButton}>Join Server</button>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.columnLeft}>
          <section>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{detail_listing.description}</p>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Mods</h2>
            <div>
              {/* TODO: So we are missing the name, description and artifacts, from the API data */}
              {/* {data.mods.map((x) => (
                <ModCard
                  key={x.name}
                  name={x.name}
                  description={x.description}
                />
              ))} */}
              {detail_listing.mods.map((x) => (
                <ModCard key={x} name={x} description={x} />
              ))}
            </div>
          </section>
        </div>

        <div className={styles.columnRight}>
          <ServerInfo {...detail_listing} />
          <ServerInstructions />
        </div>
      </div>
    </div>
  );
};

export default ServerDetail;
