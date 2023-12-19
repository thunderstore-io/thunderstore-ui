import { faBoxOpen } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PackageDependency } from "@thunderstore/dapper/types";

import { PackageDependencyDialog } from "./PackageDependencyDialog/PackageDependencyDialog";
import styles from "./PackageDependencyList.module.css";
import * as Button from "../../../Button/";
import { PackageLink } from "../../../Links/Links";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { Dialog } from "../../../../index";

// TODO: actual placeholder
const defaultImageSrc = "/images/logo.png";

interface Props {
  dependencies: PackageDependency[];
}

export function PackageDependencyList(props: Props) {
  const { dependencies } = props;

  return (
    <WrapperCard
      title="Required Mods"
      content={
        <div className={styles.root}>
          <div className={styles.listWrapper}>
            <div className={styles.list}>
              {dependencies.map((d) => (
                <PackageDependencyListItem
                  {...d}
                  key={`${d.namespace}-${d.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      }
      headerIcon={<FontAwesomeIcon icon={faBoxOpen} />}
      headerRightContent={
        <Dialog.Root
          showHeaderBorder
          title="Required mods"
          trigger={
            <div className={styles.dependencyDialogTrigger}>
              <Button.Root
                fontSize="medium"
                paddingSize="none"
                colorScheme="transparentPrimary"
              >
                <Button.ButtonLabel fontWeight="600">
                  See all
                </Button.ButtonLabel>
                <Button.ButtonIcon>
                  <FontAwesomeIcon icon={faCaretRight} />
                </Button.ButtonIcon>
              </Button.Root>
            </div>
          }
        >
          <PackageDependencyDialog packages={dependencies} />
        </Dialog.Root>
      }
    />
  );
}

PackageDependencyList.displayName = "PackageDependencyList";

const PackageDependencyListItem = (props: PackageDependency) => (
  <PackageLink
    community={props.community_identifier}
    namespace={props.namespace}
    package={props.name}
  >
    <div className={styles.item}>
      <img
        src={props.icon_url ?? defaultImageSrc}
        className={styles.itemImage}
        alt=""
      />
      <div>
        <div className={styles.itemTitle}>{props.name}</div>
        <p className={styles.itemDescription}>{props.description}</p>
      </div>
    </div>
  </PackageLink>
);

PackageDependencyListItem.displayName = "PackageDependencyListItem";
