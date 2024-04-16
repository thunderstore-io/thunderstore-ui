import { faBoxOpen } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PackageDependency } from "@thunderstore/dapper/types";

import { PackageDependencyDialog } from "./PackageDependencyDialog/PackageDependencyDialog";
import styles from "./PackageDependencyList.module.css";
import * as Button from "../../../Button/";
import { CyberstormLink } from "../../../Links/Links";
import { WrapperCard } from "../../../WrapperCard/WrapperCard";
import { Dialog } from "../../../../index";
import { ImageWithFallback } from "../../../ImageWithFallback/ImageWithFallback";

const PREVIEW_LIMIT = 4;

interface Props {
  dependencies: PackageDependency[];
  totalCount: number;
}

export function PackageDependencyList(props: Props) {
  const { dependencies, totalCount } = props;
  let countDescription = "";

  if (totalCount === 0) {
    countDescription = "This mod doesn't depend on other mods.";
  } else if (totalCount > PREVIEW_LIMIT) {
    countDescription = `+ ${totalCount - PREVIEW_LIMIT} more`;
  }

  return (
    <WrapperCard
      title="Required Mods"
      content={
        <div className={styles.root}>
          <div className={styles.listWrapper}>
            <div className={styles.list}>
              {dependencies.slice(0, PREVIEW_LIMIT).map((d) => (
                <PackageDependencyListItem
                  {...d}
                  key={`${d.namespace}-${d.name}`}
                />
              ))}
            </div>
          </div>
          {countDescription === "" ? null : (
            <p className={styles.countDescription}>{countDescription}</p>
          )}
        </div>
      }
      headerIcon={<FontAwesomeIcon icon={faBoxOpen} />}
      headerRightContent={
        totalCount > PREVIEW_LIMIT ? (
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
        ) : null
      }
    />
  );
}

PackageDependencyList.displayName = "PackageDependencyList";

const PackageDependencyListItem = (props: PackageDependency) => (
  <CyberstormLink
    linkId="Package"
    community={props.community_identifier}
    namespace={props.namespace}
    package={props.name}
  >
    <div className={styles.item}>
      <div className={styles.itemImage}>
        <ImageWithFallback src={props.icon_url} type="package" square />
      </div>
      <div>
        <div className={styles.itemTitle}>{props.name}</div>
        <p className={styles.itemDescription}>{props.description}</p>
      </div>
    </div>
  </CyberstormLink>
);

PackageDependencyListItem.displayName = "PackageDependencyListItem";
