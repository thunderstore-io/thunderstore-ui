import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useState } from "react";

import Logo from "/public/ts-logo.svg";
import {
  ServerListingDetailData,
  ServerListingData,
  ListingMod,
} from "../../api/models";
import { LaunchingModManPopup } from "../../components/LaunchingModManPopup";
import { ModCard } from "../../components/ModCard";
import { FetchListingData } from "../../api/calls";
import { ServerInfo } from "../../components/ServerInfo";
import { ServerInstructions } from "../../components/ServerInstructions";
import styles from "../../styles/ServerDetail.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  const listings = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  // TODO: Re-enable once API is up
  // try {
  //   listings = await (await fetch(ApiURLs.ServerList)).json();
  // } catch (e) {
  //   console.error(e);
  // }

  const paths = listings.results.map((listing: ServerListingData) => ({
    params: { id: listing.id },
  }));

  return { paths, fallback: "blocking" };
};

type ServerListingStaticProps = { listing_data?: ServerListingDetailData };
type ServerListingQueryProps = { id: string };

export const getStaticProps: GetStaticProps<
  ServerListingStaticProps,
  ServerListingQueryProps
> = async (context) => {
  // Params is never undefined thanks to NextJS guarantees as long as the file
  // is named appropriately.
  const listingId = context.params!.id; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const communityId = "v-rising"; // TODO: Make dynamic
  const fetched = await FetchListingData(listingId, communityId);
  return {
    props: {
      listing_data: fetched.listing_data,
      mods_data: fetched.mods_data,
    },
    revalidate: 10,
  };
};

const ServerDetail: React.FC<{
  listing_data: ServerListingDetailData;
  mods_data: ListingMod[];
}> = ({ listing_data, mods_data }) => {
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => setShowPopup((current) => !current);
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">Servers</Link>
        <span className={styles.separator}>&gt;</span>
        <span>V Rising</span>
      </div>

      <div className={styles.headerRow}>
        <h1 className={styles.listingTitle}>{listing_data.name}</h1>
        <a
          className={styles.joinServerButton}
          onClick={togglePopup}
          href={`ror2mm://v1/sync/server/${listing_data.id}/`}
        >
          <Logo />
          Join Server
        </a>
        {showPopup ? <LaunchingModManPopup togglePopup={togglePopup} /> : null}
      </div>

      <div className={styles.contentRow}>
        <div className={styles.columnLeft}>
          <section>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{listing_data.description}</p>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Mods</h2>
            <div>
              {mods_data.map((modProps) => (
                <ModCard key={modProps.full_name} {...modProps} />
              ))}
            </div>
          </section>
        </div>

        <div className={styles.columnRight}>
          <ServerInfo {...listing_data} />
          <ServerInstructions />
        </div>
      </div>
    </div>
  );
};

export default ServerDetail;
