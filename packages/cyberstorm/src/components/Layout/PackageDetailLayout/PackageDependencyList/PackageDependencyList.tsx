import styles from "./PackageDependencyList.module.css";
import { Package } from "../../../../schema";
import { PackageLink } from "../../../Links/Links";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight } from "@fortawesome/pro-solid-svg-icons";
import { Dialog } from "../../../Dialog/Dialog";
import { PackageDependencyDialog } from "./PackageDependencyDialog/PackageDependencyDialog";
import { Button } from "../../../Button/Button";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

export interface PackageDependencyListProps {
  packages?: Package[];
}

export interface PackageDependencyListItemProps {
  packageData: Package;
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
          <p className={styles.itemDescription}>
            {packageData.shortDescription}
          </p>
        </div>
      </div>
    </PackageLink>
  );
}

export function PackageDependencyList(props: PackageDependencyListProps) {
  const { packages = [] } = props;

  const mappedPackageDependencyList = packages?.map(
    (packageData: Package, index: number) => {
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
          <div className={styles.root}>
            <div className={styles.listWrapper}>
              <div className={styles.list}>{mappedPackageDependencyList}</div>
            </div>
          </div>
        }
        headerIcon={<FontAwesomeIcon icon={faBoxOpen} fixedWidth />}
        headerRightContent={
          <Dialog
            noPadding
            hideFooter
            showHeaderBorder
            title="Required mods"
            trigger={
              <div className={styles.dependencyDialogTrigger}>
                <Button
                  paddingSize="none"
                  fontSize="medium"
                  fontWeight="600"
                  colorScheme="transparentPrimary"
                  label="See all"
                  rightIcon={<FontAwesomeIcon icon={faCaretRight} fixedWidth />}
                />
              </div>
            }
            content={<PackageDependencyDialog packages={packages} />}
          />
        }
      />
    </>
  );
}

PackageDependencyList.displayName = "PackageDependencyList";
