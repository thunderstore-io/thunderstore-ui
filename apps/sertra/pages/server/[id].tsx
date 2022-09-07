import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

import Logo from "/public/ts-logo.svg";
import { ServerListingDetailData, ServerListingData } from "../../api/models";
import { ApiURLs, TsApiURLs } from "../../api/urls";
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
  const listingId = context.params!.id; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const res = await fetch(ApiURLs.ServerDetail(listingId));
  const mods_res = await fetch(TsApiURLs.V1Packages("v-rising"));
  const data = await res.json();
  const mods_data = await mods_res.json();

  const updated_listing_mods_data = [];
  for (const mod_ref of data.mods) {
    const parsed_mod_ref = [];
    // Split, reverse, put together, split by dash,
    // take each from dash split and flip it around, put into new array
    for (const x of mod_ref.split("").reverse().join("").split("-")) {
      parsed_mod_ref.push(x.split("").reverse().join(""));
    }
    const new_mod_data = {
      // We are accepting null here, just in case the data we have about mods is corrupt or bad
      name: parsed_mod_ref[1] ?? null,
      owner: parsed_mod_ref.slice(2).join("-") ?? null,
      version: parsed_mod_ref[0] ?? null,
      icon_url: null,
      description: null,
    };
    // We could use the same parser output to match against APIs results
    // But I'm waiting for opinions
    for (const mod of mods_data) {
      if (mod_ref.startsWith(mod.full_name)) {
        new_mod_data.name = mod.name;
        new_mod_data.owner = mod.owner;
        new_mod_data.version = null;
        for (const version of mod.versions) {
          if (mod_ref.endsWith(version.version_number)) {
            new_mod_data.version = version.version_number;
            new_mod_data.icon_url = version.icon;
            new_mod_data.description = version.description ?? null;
            break;
          }
        }
      }
    }
    updated_listing_mods_data.push(new_mod_data);
  }
  data.mods = updated_listing_mods_data;
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
        <button className={styles.joinServerButton}>
          <Logo />
          Join Server
        </button>
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
              {detail_listing.mods.map((x) => (
                <ModCard
                  key={x.name}
                  name={x.name}
                  owner={x.owner}
                  description={x.description ?? null}
                  version={x.version}
                  icon_url={x.icon_url}
                />
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
