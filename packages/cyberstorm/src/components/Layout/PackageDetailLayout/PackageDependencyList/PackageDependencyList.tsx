import styles from "./PackageDependencyList.module.css";
import { PackageDependency } from "../../../../schema";
import { PackageLink } from "../../../Links/Links";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/pro-light-svg-icons";
import { Button } from "../../../Button/Button";
import { faCaretRight } from "@fortawesome/pro-solid-svg-icons";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

export interface PackageDependencyListProps {
  packages?: PackageDependency[];
}

export interface PackageDependencyListItemProps {
  packageData: PackageDependency;
}

function PackageDependencyListItem(props: PackageDependencyListItemProps) {
  const { packageData } = props;

  return (
    <PackageLink
      package={packageData.name}
      community={packageData.community}
      namespace={packageData.namespace}
    >
      <div className={styles.item}>
        <img
          src={
            packageData.imageSource ? packageData.imageSource : defaultImageSrc
          }
          className={styles.itemImage}
          alt={packageData.name}
        />
        <div>
          <div className={styles.itemTitle}>{packageData.name}</div>
          <div className={styles.itemDescription}>
            {packageData.shortDescription}
          </div>
        </div>
      </div>
    </PackageLink>
  );
}

export function PackageDependencyList(props: PackageDependencyListProps) {
  const { packages = [] } = props;

  const mappedPackageDependencyList = packages?.map(
    (packageData: PackageDependency, index: number) => {
      return (
        <div key={index}>
          <PackageDependencyListItem packageData={packageData} />
        </div>
      );
    }
  );

  return (
    <>
      <WrapperCard
        title="Required Mods"
        content={
          <div className={styles.list}>{mappedPackageDependencyList}</div>
        }
        headerIcon={<FontAwesomeIcon icon={faBox} fixedWidth />}
        headerRightContent={
          <Button
            label="See all"
            rightIcon={<FontAwesomeIcon icon={faCaretRight} fixedWidth />}
            colorScheme="transparentPrimary"
            size="small"
          />
        }
      />
    </>
  );
}

PackageDependencyList.displayName = "PackageDependencyList";
