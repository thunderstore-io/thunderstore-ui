import styles from "./PackageDependencyList.module.css";
import { PackageDependency } from "@thunderstore/dapper/types";
import { PackageLink } from "../../../Links/Links";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight } from "@fortawesome/pro-solid-svg-icons";
import { Dialog } from "../../../Dialog/Dialog";
import { PackageDependencyDialog } from "./PackageDependencyDialog/PackageDependencyDialog";
import * as Button from "../../../Button/";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { Icon } from "../../../Icon/Icon";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

export interface PackageDependencyListProps {
  namespace: string;
  community: string;
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
          <p className={styles.itemDescription}>
            {packageData.shortDescription}
          </p>
        </div>
      </div>
    </PackageLink>
  );
}

export function PackageDependencyList(props: PackageDependencyListProps) {
  const { namespace, community } = props;

  const dapper = useDapper();
  const packageDependencyData = usePromise(dapper.getPackageDependencies, [
    community,
    namespace,
  ]);

  const mappedPackageDependencyList = packageDependencyData?.map(
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
          <div className={styles.root}>
            <div className={styles.listWrapper}>
              <div className={styles.list}>{mappedPackageDependencyList}</div>
            </div>
          </div>
        }
        headerIcon={
          <Icon>
            <Icon>
              <FontAwesomeIcon icon={faBoxOpen} />
            </Icon>
          </Icon>
        }
        headerRightContent={
          <Dialog
            noPadding
            hideFooter
            showHeaderBorder
            title="Required mods"
            trigger={
              <div className={styles.dependencyDialogTrigger}>
                <Button.Root paddingSize="none" variant="transparentPrimary">
                  <Button.ButtonLabel fontWeight="600">
                    See all
                  </Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <Icon>
                      <FontAwesomeIcon icon={faCaretRight} />
                    </Icon>
                  </Button.ButtonIcon>
                </Button.Root>
              </div>
            }
            content={
              <PackageDependencyDialog packages={packageDependencyData} />
            }
          />
        }
      />
    </>
  );
}

PackageDependencyList.displayName = "PackageDependencyList";
