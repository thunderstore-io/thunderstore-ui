"use client";
import {
  Button,
  Dialog,
  ImageWithFallback,
  CyberstormLink,
} from "@thunderstore/cyberstorm";
import { faBoxOpen } from "@fortawesome/pro-regular-svg-icons";
import { faCaretRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./PackageDependencyList.module.css";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { WrapperCard } from "@thunderstore/cyberstorm/src/components/WrapperCard/WrapperCard";
import { PackageDependency } from "@thunderstore/dapper/types";
import { ReactNode, Suspense } from "react";

const PREVIEW_LIMIT = 4;

export default function PackageDependencyListLayout({
  packageDependencyDialog,
  params,
}: {
  packageDependencyDialog: ReactNode;
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);

  let countDescription = "";

  if (packageData.dependency_count === 0) {
    countDescription = "This mod doesn't depend on other mods.";
  } else if (packageData.dependency_count > PREVIEW_LIMIT) {
    countDescription = `+ ${packageData.dependency_count - PREVIEW_LIMIT} more`;
  }

  return (
    <WrapperCard
      title="Required Mods"
      content={
        <div className={styles.root}>
          <div className={styles.listWrapper}>
            <div className={styles.list}>
              {packageData.dependencies.slice(0, PREVIEW_LIMIT).map((d) => (
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
        packageData.dependency_count > PREVIEW_LIMIT ? (
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
            <Suspense fallback={<p>TODO: SKELETON packageTeamMemberList</p>}>
              {packageDependencyDialog}
            </Suspense>
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
