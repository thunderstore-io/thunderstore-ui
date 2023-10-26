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
import { PackageLink, UserLink } from "../Links/Links";
import { faLips, faSparkles } from "@fortawesome/pro-solid-svg-icons";

interface Props {
  package: PackagePreview;
}

/**
 * Cyberstorm PackageCard component
 */
export function PackageCard(props: Props) {
  const { package: packageData } = props;

  return (
    <div className={classnames(styles.root, styles.packageCard__default)}>
      <div className={styles.imageWrapper}>
        <PackageLink
          namespace={packageData.namespace}
          package={packageData.name}
          community={packageData.community}
        >
          {packageData.imageSource ? (
            <img
              className={styles.image}
              src={packageData.imageSource}
              alt={packageData.name}
            />
          ) : null}
          {getPackageFlags(packageData)}
        </PackageLink>
      </div>

      <div className={styles.content}>
        <PackageLink
          namespace={packageData.namespace}
          package={packageData.name}
          community={packageData.community}
        >
          <div className={styles.title}>{packageData.name}</div>
        </PackageLink>

        {packageData.author ? (
          <div className={styles.author}>
            <span className={styles.author_prefix}>by</span>
            <UserLink user={packageData.author}>
              <div className={styles.author_label}>{packageData.author}</div>
            </UserLink>
          </div>
        ) : null}

        {packageData.description ? (
          <p className={styles.description}>{packageData.description}</p>
        ) : null}
      </div>

      {packageData.categories?.length > 0 ? (
        <div className={styles.categoryWrapper}>
          {packageData.categories.map((c, index) => (
            <div key={`category_${c}_${index}`} className={styles.categoryTag}>
              {c.name}
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.footer}>{getMetaItemList(packageData)}</div>
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
