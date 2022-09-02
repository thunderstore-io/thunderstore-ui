import Link from "next/link";
import { useRouter } from "next/router";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { useServerListings } from "../api/hooks";
import { ServerListingData } from "../api/models";
import { ServerMode, ServerPassword } from "./listingAttributes";
import styles from "./ServerList.module.css";

interface ServerListEntryProps {
  listing: ServerListingData;
}
const ServerListEntry: React.FC<PropsWithChildren<ServerListEntryProps>> = ({
  listing,
}) => {
  return (
    <Link href={`/server/` + listing.id} key={listing.id}>
      <div className={styles.row}>
        <div className={`${styles.name} ellipsis`}>{listing.name}</div>
        <ServerMode isPvP={listing.is_pvp} />
        <div>{listing.mod_count}</div>
        <ServerPassword requiresPassword={listing.requires_password} />
      </div>
    </Link>
  );
};

interface ServerListPaginatorProps {
  next: string | null;
  prev: string | null;
  setCursor: Dispatch<SetStateAction<string | undefined>>;
}
const ServerListPaginator: React.FC<ServerListPaginatorProps> = ({
  next,
  prev,
  setCursor,
}) => {
  const router = useRouter();
  const onClick = (cursor: string) => {
    router.replace({ pathname: "/", query: { cursor } });
    setCursor(cursor);
  };

  return (
    <div className={styles.paginator}>
      {prev && (
        <button type="button" onClick={() => onClick(prev)}>
          &lt; Prev
        </button>
      )}

      {next && (
        <button type="button" onClick={() => onClick(next)}>
          Next &gt;
        </button>
      )}
    </div>
  );
};

interface ServerListProps {
  community: string;
}
export const ServerList: React.FC<PropsWithChildren<ServerListProps>> = ({
  community,
}) => {
  const [currentCursor, setCurrentCursor] = useState<string>();
  const { data } = useServerListings(currentCursor);
  const next = data?.next ? data?.next.split("=")[1] : null;
  const prev = data?.previous ? data?.previous.split("=")[1] : null;

  // TODO: Pull from API
  const gameDisplayName = useMemo(() => {
    return community.replaceAll("-", " ");
  }, [community]);

  return (
    <>
      <h1 className={styles.header}>Servers</h1>
      <div className={styles.paginatorWrapper}>
        <h2 className={styles.header}>{gameDisplayName}</h2>
        <ServerListPaginator
          next={next}
          prev={prev}
          setCursor={setCurrentCursor}
        />
      </div>
      <div className={styles.tableHeader}>
        <div className={styles.name}>Server Name</div>
        <div className={styles.mode}>Mode</div>
        <div className={styles.mods}>Mods</div>
        <div className={styles.password}>Password</div>
      </div>

      {data?.results.map((x) => (
        <ServerListEntry key={x.id} listing={x} />
      ))}

      <div className={styles.paginatorWrapper}>
        <ServerListPaginator
          next={next}
          prev={prev}
          setCursor={setCurrentCursor}
        />
      </div>
    </>
  );
};
