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
        <div className={styles.listingTitle}>{detail_listing.name}</div>
        <div className={styles.joinServerButton}>Join Server</div>
      </div>
      <div className={styles.contentRow}>
        <div className={styles.columnLeft}>
          <div>
            <div className={styles.description}>
              <div className={styles.sectionTitle}>Description</div>
              <div className={styles.descriptionContent}>
                <div>{detail_listing.description}</div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className={styles.sectionTitle}>Mods</div>
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
            </div>
          </div>
        </div>
        <div className={styles.columnRight}>
          <div>
            <div>
              <div className={styles.sectionTitle}>Server Info</div>
              <div>
                <div className={styles.serverInfoRow}>
                  <div className={styles.serverInfoColumn}>Game</div>
                  <div className={styles.serverInfoColumn}>
                    <div>V Rising</div>
                  </div>
                </div>
                <div className={styles.serverInfoRow}>
                  <div className={styles.serverInfoColumn}>Server Name</div>
                  <div className={styles.serverInfoColumn}>
                    <div>{detail_listing.name}</div>
                  </div>
                </div>
                <div className={styles.serverInfoRow}>
                  <div className={styles.serverInfoColumn}>IP:Port</div>
                  <div className={styles.serverInfoColumn}>
                    <div>{detail_listing.connection_data}</div>
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
                  <div className={styles.serverInfoColumn}>42</div>
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
            </div>
          </div>
          <div>
            <div>
              <div className={styles.sectionTitle}>How To Play</div>
              <div className={styles.descriptionContent}>
                <div>
                  1. Click butan<br></br>
                  2. Öpens TMM<br></br>
                  3. Sync Mods<br></br>
                  4. Enjoy<br></br>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerDetail;
