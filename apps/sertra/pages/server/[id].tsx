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
    for (const mod of mods_data) {
      const [mod_ref_owner, mod_ref_name, mod_ref_version] = mod_ref.split(
        "-",
        3
      );
      if (mod_ref_owner === mod.owner && mod_ref_name === mod.name) {
        for (const version of mod.versions) {
          if (mod_ref_version === version.version_number) {
            updated_listing_mods_data.push({
              name: mod.name,
              owner: mod.owner,
              version: version.version_number,
              icon_url: version.icon,
              description: version.description ?? null,
            });
          }
        }
      }
    }
  }
  data.mods = updated_listing_mods_data;
  // TODO: What if mod is not found?
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
