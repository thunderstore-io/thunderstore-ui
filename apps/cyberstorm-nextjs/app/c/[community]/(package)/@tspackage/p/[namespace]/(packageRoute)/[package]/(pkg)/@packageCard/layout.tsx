"use client";
import { PageHeader, Dialog, Button, TeamLink } from "@thunderstore/cyberstorm";
import styles from "./PackageDetailLayout.module.css";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import {
  faArrowUpRight,
  faUsers,
  faCog,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, Suspense } from "react";

export default function PackageCardLayout({
  packageManagement,
  params,
}: {
  packageManagement: ReactNode;
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);
  const displayName = params.package.replace(/_/g, " ");

  const packageDetailsMeta = [
    <TeamLink
      key="team"
      community={packageData.community_identifier}
      team={packageData.namespace}
    >
      <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
        <Button.ButtonIcon>
          <FontAwesomeIcon icon={faUsers} />
        </Button.ButtonIcon>
        <Button.ButtonLabel>{packageData.namespace}</Button.ButtonLabel>
      </Button.Root>
    </TeamLink>,
  ];

  if (packageData.website_url) {
    packageDetailsMeta.push(
      <a key="website" href={packageData.website_url}>
        <Button.Root plain colorScheme="transparentPrimary" paddingSize="small">
          <Button.ButtonLabel>{packageData.website_url}</Button.ButtonLabel>
          <Button.ButtonIcon>
            <FontAwesomeIcon icon={faArrowUpRight} />
          </Button.ButtonIcon>
        </Button.Root>
      </a>
    );
  }

  return (
    <div className={styles.packageInfo}>
      <PageHeader
        title={displayName}
        image={
          <img className={styles.modImage} alt="" src={packageData.icon_url} />
        }
        description={packageData.description}
        meta={packageDetailsMeta}
      />
      <div className={styles.headerActions}>
        <Dialog.Root
          title="Manage Package"
          trigger={
            <Button.Root colorScheme="primary" paddingSize="medium">
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faCog} />
              </Button.ButtonIcon>
              <Button.ButtonLabel>Manage</Button.ButtonLabel>
            </Button.Root>
          }
        >
          <Suspense fallback={<p>TODO: SKELETON packageManagement</p>}>
            {packageManagement}
          </Suspense>
        </Dialog.Root>
        <a href={packageData.install_url} className={styles.installButton}>
          <Button.Root plain paddingSize="huge" colorScheme="fancyAccent">
            <Button.ButtonIcon iconSize="big">
              <ThunderstoreLogo />
            </Button.ButtonIcon>
            <Button.ButtonLabel fontSize="huge" fontWeight="800">
              Install
            </Button.ButtonLabel>
          </Button.Root>
        </a>
      </div>
    </div>
  );
}
