import { ReactNode } from "react";
import styles from "./PackageCard.module.css";
import { MetaItem } from "../MetaItem/MetaItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faThumbsUp,
  faThumbtack,
  faClock,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { Tag } from "../Tag/Tag";
import { classnames, formatInteger } from "../../utils/utils";
import { PackageListing } from "@thunderstore/dapper/types";
import { CyberstormLink } from "../Links/Links";
import { faBomb } from "@fortawesome/free-solid-svg-icons";

interface Props {
  package: PackageListing;
}

/**
 * Cyberstorm PackageCard component
 */
export function PackageCard(props: Props) {
  const { package: p } = props;

  return (
    <div className={classnames(styles.root, styles.packageCard__default)}>
      <div className={styles.imageWrapper}>
        <CyberstormLink
          linkId="Package"
          community={p.community_identifier}
          namespace={p.namespace}
          package={p.name}
        >
          <img className={styles.image} src={p.icon_url} alt={p.name} />
          {getPackageFlags(p)}
        </CyberstormLink>
      </div>

      <div className={styles.content}>
        <CyberstormLink
          linkId="Package"
          community={p.community_identifier}
          namespace={p.namespace}
          package={p.name}
        >
          <div className={styles.title}>{p.name}</div>
        </CyberstormLink>

        <div className={styles.author}>
          <span className={styles.author_prefix}>by</span>
          <CyberstormLink
            linkId="Team"
            community={p.community_identifier}
            team={p.namespace}
          >
            <div className={styles.author_label}>{p.namespace}</div>
          </CyberstormLink>
        </div>

        {p.description ? (
          <p className={styles.description}>{p.description}</p>
        ) : null}
      </div>

      {p.categories.length ? (
        <div className={styles.categoryWrapper}>
          {p.categories.map((c, index) => (
            <div key={`category_${c}_${index}`} className={styles.categoryTag}>
              {c.name}
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.footer}>{getMetaItemList(p)}</div>
    </div>
  );
}

PackageCard.displayName = "PackageCard";

function getPackageFlags(packageData: PackageListing) {
  const updateTimeDelta = Math.round(
    (Date.now() - Date.parse(packageData.last_updated)) / 86400000
  );
  const isNew = updateTimeDelta < 3;
  if (
    !packageData.is_pinned &&
    !packageData.is_nsfw &&
    !packageData.is_deprecated &&
    !isNew
  ) {
    return null;
  }
  const flagList: ReactNode[] = [];
  if (packageData.is_pinned) {
    flagList.push(
      <Tag
        key="flag_pinned"
        label="Pinned"
        colorScheme="blue"
        leftIcon={<FontAwesomeIcon icon={faThumbtack} />}
      />
    );
  }
  if (packageData.is_deprecated) {
    flagList.push(
      <Tag
        key="flag_deprecated"
        label="Deprecated"
        colorScheme="yellow"
        leftIcon={<FontAwesomeIcon icon={faWarning} />}
      />
    );
  }
  if (packageData.is_nsfw) {
    flagList.push(
      <Tag
        key="flag_nsfw"
        label="NSFW"
        colorScheme="pink"
        leftIcon={<FontAwesomeIcon icon={faBomb} />}
      />
    );
  }
  if (isNew) {
    flagList.push(
      <Tag
        key="flag_nsfw"
        label="New"
        colorScheme="green"
        leftIcon={<FontAwesomeIcon icon={faBomb} />}
      />
    );
  }
  return <div className={styles.flagWrapper}>{flagList}</div>;
}

function getMetaItemList(packageData: PackageListing) {
  const updateTimeDelta = Math.round(
    (Date.now() - Date.parse(packageData.last_updated)) / 86400000
  );
  return (
    <div className={styles.metaItemWrapper}>
      <MetaItem
        icon={<FontAwesomeIcon icon={faClock} />}
        label={`${updateTimeDelta} days`}
        colorScheme="tertiary"
      />
      <MetaItem
        icon={<FontAwesomeIcon icon={faDownload} />}
        label={formatInteger(packageData.download_count)}
        colorScheme="tertiary"
      />
      <MetaItem
        icon={<FontAwesomeIcon icon={faThumbsUp} />}
        label={formatInteger(packageData.rating_count)}
        colorScheme="tertiary"
      />
    </div>
  );
}
