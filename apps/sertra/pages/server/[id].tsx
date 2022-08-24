import { GetStaticPaths, GetStaticProps } from "next";

import { ServerListingDetailData, ServerListingData } from "../../api/models";
import { ApiURLs } from "../../api/urls";
import { ServerMode, ServerPassword } from "../../components/listingAttributes";
import { ModCard } from "../../components/ModCard";
import styles from "../../components/ServerDetail.module.css";

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
          <section>
            <h2 className={styles.sectionTitle}>Server Info</h2>
            <div>
              <div className={styles.serverInfoRow}>
                <div className={styles.serverInfoColumn}>Game</div>
                <div className={styles.serverInfoColumn}>V Rising</div>
              </div>
              <div className={styles.serverInfoRow}>
                <div className={styles.serverInfoColumn}>Server Name</div>
                <div className={styles.serverInfoColumn}>
                  {detail_listing.name}
                </div>
              </div>
              <div className={styles.serverInfoRow}>
                <div className={styles.serverInfoColumn}>IP:Port</div>
                <div className={styles.serverInfoColumn}>
                  {detail_listing.connection_data}
                </div>
              </div>
              <div className={styles.serverInfoRow}>
                <div className={styles.serverInfoColumn}>Mode</div>
                <div className={styles.serverInfoColumn}>
                  <ServerMode isPvP={detail_listing.is_pvp} />
                </div>
              </div>
              <div className={styles.serverInfoRow}>
                <div className={styles.serverInfoColumn}>Mods</div>
                <div className={styles.serverInfoColumn}>
                  {detail_listing.mods.length}
                </div>
              </div>
              <div className={styles.serverInfoRow}>
                <div className={styles.serverInfoColumn}>
                  Password Protected
                </div>
                <div className={styles.serverInfoColumn}>
                  <ServerPassword
                    requiresPassword={detail_listing.requires_password}
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>How To Play</h2>
            <ol className={styles.instructions}>
              <li>Click butan</li>
              <li>Öpens TMM</li>
              <li>Sync Mods</li>
              <li>Enjoy</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ServerDetail;
