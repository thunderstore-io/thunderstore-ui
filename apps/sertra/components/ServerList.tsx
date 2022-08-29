import { useServerListings } from "../api/hooks";
import { ServerListingData } from "../api/models";
import { PropsWithChildren, useMemo } from "react";
import styles from "./ServerList.module.css";

interface ServerModeProps {
  isPvP: boolean;
}
const ServerMode: React.FC<PropsWithChildren<ServerModeProps>> = ({
  isPvP,
}) => {
  if (isPvP) {
    return <div className={styles.pvp}>PvP</div>;
  } else {
    return <div className={styles.pve}>PvE</div>;
  }
};

interface ServerPasswordProps {
  requiresPassword: boolean;
}
const ServerPassword: React.FC<PropsWithChildren<ServerPasswordProps>> = ({
  requiresPassword,
}) => {
  if (requiresPassword) {
    return <div>🔒</div>;
  } else {
    return null;
  }
};

interface ServerListEntryProps {
  listing: ServerListingData;
}

const ServerListEntry: React.FC<PropsWithChildren<ServerListEntryProps>> = ({
  listing,
}) => {
  return (
    <div className={styles.row}>
      <div className={styles.name}>{listing.name}</div>
      <div className={styles.mode}>
        <ServerMode isPvP={listing.is_pvp} />
      </div>
      <div className={styles.mods}>42</div>
      <div className={styles.password}>
        <ServerPassword requiresPassword={listing.requires_password} />
      </div>
    </div>
  );
};

interface ServerListProps {
  community: string;
}
export const ServerList: React.FC<PropsWithChildren<ServerListProps>> = ({
  community,
}) => {
  const { data } = useServerListings();

  // TODO: Pull from API
  const gameDisplayName = useMemo(() => {
    return community.replaceAll("-", " ");
  }, [community]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.pageTitle}>Servers</div>
          <div className={styles.gameTitle}>{gameDisplayName}</div>
        </div>
      </div>
      <div className={styles.tableHeader}>
        <div className={styles.name}>Server Name</div>
        <div className={styles.mode}>Mode</div>
        <div className={styles.mods}>Mods</div>
        <div className={styles.password}>Password</div>
      </div>
      <div>
        {data?.results.map((x) => (
          <ServerListEntry key={x.id} listing={x} />
        ))}
      </div>
    </div>
  );
};
