import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

import { useServerListings } from "../api/hooks";
import { ServerListingData } from "../api/models";
import { ServerMode, ServerPassword } from "./ListingAttributes";
import styles from "./ServerList.module.css";

interface ServerListEntryProps {
  listing: ServerListingData;
}
function ServerListEntry(props: ServerListEntryProps) {
  const { listing } = props;
  return (
    <Link href={`/server/` + listing.id} passHref key={listing.id}>
      <a href="replacedByLink" className={styles.row}>
        <div className={`${styles.name} ellipsis`}>{listing.name}</div>
        <ServerMode isPvP={listing.is_pvp} />
        <div>{listing.mod_count}</div>
        <ServerPassword requiresPassword={listing.requires_password} />
      </a>
    </Link>
  );
}

interface ServerListPaginatorProps {
  next: string | null;
  prev: string | null;
  setCursor: Dispatch<SetStateAction<string | undefined>>;
}
function ServerListPaginator(props: ServerListPaginatorProps) {
  const { next, prev, setCursor } = props;
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
}

interface ServerListProps {
  community: string;
}
export function ServerList({ community }: ServerListProps) {
  const [currentCursor, setCurrentCursor] = useState<string>();
  const { data } = useServerListings(currentCursor);
  const next = data?.next ? data?.next.split("=")[1] : null;
  const prev = data?.previous ? data?.previous.split("=")[1] : null;
  const gameDisplayName = community.replaceAll("-", " "); // TODO: Pull from API

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

      <ul className={styles.listings}>
        {data?.results.map((x) => (
          <li key={x.id}>
            <ServerListEntry listing={x} />
          </li>
        ))}
      </ul>

      <div className={styles.paginatorWrapper}>
        <ServerListPaginator
          next={next}
          prev={prev}
          setCursor={setCurrentCursor}
        />
      </div>
    </>
  );
}
