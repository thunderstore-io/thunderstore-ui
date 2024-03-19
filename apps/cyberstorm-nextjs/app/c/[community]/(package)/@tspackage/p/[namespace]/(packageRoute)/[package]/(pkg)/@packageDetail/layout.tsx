"use client";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import {
  faDonate,
  faDownload,
  faThumbsUp,
  faFlag,
  faBoxes,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./PackageDetailsLayout.module.css";
import { Button, Icon, Tag } from "@thunderstore/cyberstorm";
import { ReactNode, Suspense } from "react";
import { WrapperCard } from "@thunderstore/cyberstorm/src/components/WrapperCard/WrapperCard";

export default function PackageDetailsLayout({
  packageMeta,
  packageTagList,
  packageDependencyList,
  packageTeamMemberList,
  params,
}: {
  packageMeta: ReactNode;
  packageTagList: ReactNode;
  packageDependencyList: ReactNode;
  packageTeamMemberList: ReactNode;
  params: { community: string; namespace: string; package: string };
}) {
  const dapper = useDapper();
  const packageData = usePromise(dapper.getPackageListingDetails, [
    params.community,
    params.namespace,
    params.package,
  ]);

  const mappedPackageTagList = packageData.categories.map((category) => {
    return (
      <Tag
        colorScheme="borderless_no_hover"
        size="mediumPlus"
        key={category.name}
        label={category.name.toUpperCase()}
      />
    );
  });

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <a href={packageData.download_url} className={styles.download}>
          <DownloadButton />
        </a>
        <DonateButton onClick={TODO} />
        <LikeButton onClick={TODO} />
        <ReportButton onClick={TODO} />
      </div>
      <Suspense fallback={<p>TODO: SKELETON packageMeta</p>}>
        {packageMeta}
      </Suspense>
      <WrapperCard
        title="Categories"
        content={
          <div className={styles.categories}>{mappedPackageTagList}</div>
        }
        headerIcon={
          <Icon>
            <FontAwesomeIcon icon={faBoxes} />
          </Icon>
        }
      />
      <Suspense fallback={<p>TODO: SKELETON packageTagList</p>}>
        {packageTagList}
      </Suspense>
      <Suspense fallback={<p>TODO: SKELETON packageDependencyList</p>}>
        {packageDependencyList}
      </Suspense>
      <Suspense fallback={<p>TODO: SKELETON packageTeamMemberList</p>}>
        {packageTeamMemberList}
      </Suspense>
    </div>
  );
}

const TODO = () => Promise.resolve();

interface Clickable {
  onClick: () => Promise<void>;
}

const LikeButton = (props: Clickable) => (
  <Button.Root
    onClick={props.onClick}
    tooltipText="Like"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faThumbsUp} />
    </Button.ButtonIcon>
  </Button.Root>
);

const DonateButton = (props: Clickable) => (
  <Button.Root
    onClick={props.onClick}
    tooltipText="Donate to author"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faDonate} />
    </Button.ButtonIcon>
  </Button.Root>
);

const ReportButton = (props: Clickable) => (
  <Button.Root
    onClick={props.onClick}
    tooltipText="Report"
    colorScheme="primary"
    paddingSize="mediumSquare"
  >
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faFlag} />
    </Button.ButtonIcon>
  </Button.Root>
);

const DownloadButton = () => (
  <Button.Root plain colorScheme="primary" paddingSize="medium">
    <Button.ButtonIcon>
      <FontAwesomeIcon icon={faDownload} />
    </Button.ButtonIcon>
    <Button.ButtonLabel>Download</Button.ButtonLabel>
  </Button.Root>
);
