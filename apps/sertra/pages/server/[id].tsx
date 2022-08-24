import { ServerListingDetailData, ServerListingData } from "../../api/models";
import { PropsWithChildren } from "react";
import styles from "../../components/ServerDetail.module.css";
import { ApiURLs } from "../../api/urls";
import { GetStaticPaths, GetStaticProps } from "next";
import { ServerMode, ServerPassword } from "../../components/listingAttributes";

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

interface ServerListingModProps {
  name: string;
  description: string;
}

const ServerListingMod: React.FC<PropsWithChildren<ServerListingModProps>> = ({
  name,
  description,
}) => {
  return (
    <div className={styles.modRow}>
      <div className={styles.modRowColumn}>
        <div className={styles.modImg}></div>
      </div>
      <div className={styles.modRowColumn}>
        <div className={styles.modContentRow}>
          <div className={styles.modName}>{name}</div>
        </div>
        <div className={styles.modContentRow}>
          <div className={styles.modDescription}>{description}</div>
        </div>
        <div className={styles.modContentRow}>
          <div className={styles.modArtifacts}>
            <div className={styles.artifact}>
              <div className={styles.artifactText}>Artifacts</div>
            </div>
            <div className={styles.artifact}>
              <div className={styles.artifactText}>Artifacts</div>
            </div>
            <div className={styles.artifact}>
              <div className={styles.artifactText}>Artifacts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServerDetail: React.FC<{ detail_listing: ServerListingDetailData }> = ({
  detail_listing,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.listingTitle}>{detail_listing.name}</div>
        <div className={styles.joinServerButton}>
          <div className={styles.joinServerButtonText}>Join Server</div>
        </div>
      </div>
      <div className={styles.contentRow}>
        <div className={styles.columnLeft}>
          <div>
            <div className={styles.description}>
              <div className={styles.sectionTitle}>Description</div>
              <div className={styles.descriptionContent}>
                <div className={styles.descriptionContentText}>
                  {detail_listing.description}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.mods}>
              <div className={styles.sectionTitle}>Mods</div>
              <div>
                {/* TODO: So we are missing the name, description and artifacts, from the API data */}
                {/* {data.mods.map((x) => (
                  <ServerListingMod
                    key={x.name}
                    name={x.name}
                    description={x.description}
                  />
                ))} */}
                {detail_listing.mods.map((x) => (
                  <ServerListingMod key={x} name={x} description={x} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.columnRight}>
          <div>
            <div>
              <div className={styles.sectionTitle}>Server Info</div>
              <div className={styles.serverInfoContent}>
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
                <div className={styles.descriptionContentText}>
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
