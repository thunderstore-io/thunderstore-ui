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
import { bankersRound, classnames, formatInteger } from "../../utils/utils";
import { PackagePreview } from "@thunderstore/dapper/types";
import { PackageLink, TeamLink } from "../Links/Links";
import { faLips, faSparkles } from "@fortawesome/pro-solid-svg-icons";

interface Props {
  package: PackagePreview;
}

/**
 * Cyberstorm PackageCard component
 */
export function PackageCard(props: Props) {
  const { package: p } = props;

  return (
    <div className={classnames(styles.root, styles.packageCard__default)}>
      <div className={styles.imageWrapper}>
        <PackageLink
          community={p.community}
          namespace={p.namespace}
          package={p.name}
        >
          {p.imageSource ? (
            <img className={styles.image} src={p.imageSource} alt={p.name} />
          ) : null}
          {getPackageFlags(p)}
        </PackageLink>
      </div>

      <div className={styles.content}>
        <PackageLink
          community={p.community}
          namespace={p.namespace}
          package={p.name}
        >
          <div className={styles.title}>{p.name}</div>
        </PackageLink>

        <div className={styles.author}>
          <span className={styles.author_prefix}>by</span>
          <TeamLink community={p.community} team={p.namespace}>
            <div className={styles.author_label}>{p.namespace}</div>
          </TeamLink>
        </div>

        {p.description ? (
          <p className={styles.description}>{p.description}</p>
        ) : null}
      </div>

      {p.categories?.length > 0 ? (
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

function getPackageFlags(packageData: PackagePreview) {
  const updateTimeDelta = bankersRound(
    (Date.now() - Date.parse(packageData.lastUpdated)) / 86400000,
    0
  );
  const isNew = updateTimeDelta < 3;
  if (
    !packageData.isPinned &&
    !packageData.isNsfw &&
    !packageData.isDeprecated &&
    !isNew
  ) {
    return null;
  }
  const flagList: ReactNode[] = [];
  if (packageData.isPinned) {
    flagList.push(
      <Tag
        key="flag_pinned"
        label="Pinned"
        colorScheme="blue"
        leftIcon={<FontAwesomeIcon icon={faThumbtack} />}
      />
    );
  }
  if (packageData.isDeprecated) {
    flagList.push(
      <Tag
        key="flag_deprecated"
        label="Deprecated"
        colorScheme="yellow"
        leftIcon={<FontAwesomeIcon icon={faWarning} />}
      />
    );
  }
  if (packageData.isNsfw) {
    flagList.push(
      <Tag
        key="flag_nsfw"
        label="NSFW"
        colorScheme="pink"
        leftIcon={<FontAwesomeIcon icon={faLips} />}
      />
    );
  }
  if (isNew) {
    flagList.push(
      <Tag
        key="flag_nsfw"
        label="New"
        colorScheme="green"
        leftIcon={<FontAwesomeIcon icon={faSparkles} />}
      />
    );
  }
  return <div className={styles.flagWrapper}>{flagList}</div>;
}

function getMetaItemList(packageData: PackagePreview) {
  const updateTimeDelta = bankersRound(
    (Date.now() - Date.parse(packageData.lastUpdated)) / 86400000,
    0
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
        label={formatInteger(packageData.downloadCount)}
        colorScheme="tertiary"
      />
      <MetaItem
        icon={<FontAwesomeIcon icon={faThumbsUp} />}
        label={formatInteger(packageData.likes)}
        colorScheme="tertiary"
      />
    </div>
  );
}
