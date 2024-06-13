import {
  Button,
  Dialog,
  ImageWithFallback,
  CyberstormLink,
} from "@thunderstore/cyberstorm";
import { faBoxOpen } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Dependencies.module.css";
import { WrapperCard } from "@thunderstore/cyberstorm/src/components/WrapperCard/WrapperCard";
import {
  PackageDependency,
  PackageListingDetails,
} from "@thunderstore/dapper/types";
import DependencyDialog from "./DependencyDialog/DependencyDialog";

const PREVIEW_LIMIT = 4;

export default function Dependencies(props: {
  listing: PackageListingDetails;
}) {
  let countDescription = "";

  if (props.listing.dependency_count === 0) {
    countDescription = "This mod doesn't depend on other mods.";
  } else if (props.listing.dependency_count > PREVIEW_LIMIT) {
    countDescription = `+ ${
      props.listing.dependency_count - PREVIEW_LIMIT
    } more`;
  }

  return (
    <WrapperCard
      title="Required Mods"
      content={
        <div className={styles.root}>
          <div className={styles.listWrapper}>
            <div className={styles.list}>
              {props.listing.dependencies.slice(0, PREVIEW_LIMIT).map((d) => (
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
        props.listing.dependency_count > PREVIEW_LIMIT ? (
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
            <DependencyDialog listing={props.listing} />
          </Dialog.Root>
        ) : null
      }
    />
  );
}

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
