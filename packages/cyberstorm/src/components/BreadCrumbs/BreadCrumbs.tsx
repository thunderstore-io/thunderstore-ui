import React, { PropsWithChildren } from "react";

import { faHouse } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./BreadCrumbs.module.css";
import {
  CommunitiesLink,
  CommunityLink,
  IndexLink,
  PackageLink,
  TeamsLink,
} from "../Links/Links";

type PageTitleCrumbProps = PropsWithChildren<{
  pageTitle: string;
}>;

type BreadCrumbsProps = PropsWithChildren<{
  pageTitle: string;
}>;

interface PackageBreadCrumbsProps extends BreadCrumbsProps {
  community: string;
}

interface PackageDependantsBreadCrumbsProps {
  community: string;
  packageName: string;
  packageNameSpace: string;
}

export function DefaultHomeCrumb() {
  return (
    <IndexLink className={`${styles.outer} ${styles.outer__start}`}>
      <div className={styles.inner}>
        <FontAwesomeIcon fixedWidth icon={faHouse} className={styles.home} />
      </div>
    </IndexLink>
  );
}

export function PageTitleCrumb(props: PageTitleCrumbProps) {
  const { pageTitle } = props;
  return (
    <div className={`${styles.outer} ${styles.outer__end}`}>
      <div className={`${styles.inner} ${styles.inner__end}`}>{pageTitle}</div>
    </div>
  );
}

export function HomeOnlyBreadCrumbs() {
  return (
    <div className={styles.root}>
      <DefaultHomeCrumb />
    </div>
  );
}

export function TitleOnlyBreadCrumbs(props: BreadCrumbsProps) {
  const { pageTitle } = props;
  return (
    <div className={styles.root}>
      <DefaultHomeCrumb />
      <PageTitleCrumb pageTitle={pageTitle} />
    </div>
  );
}

export function CommunityBreadCrumbs(props: BreadCrumbsProps) {
  const { pageTitle } = props;
  return (
    <div className={styles.root}>
      <DefaultHomeCrumb />
      <CommunitiesLink className={styles.outer}>
        <div className={styles.inner}>Communities</div>
      </CommunitiesLink>
      <PageTitleCrumb pageTitle={pageTitle} />
    </div>
  );
}

export function PackageBreadCrumbs(props: PackageBreadCrumbsProps) {
  const { community, pageTitle } = props;
  return (
    <div className={styles.root}>
      <DefaultHomeCrumb />
      <CommunitiesLink className={styles.outer}>
        <div className={styles.inner}>Communities</div>
      </CommunitiesLink>
      <CommunityLink community={community} className={styles.outer}>
        <div className={styles.inner}>{community}</div>
      </CommunityLink>
      <PageTitleCrumb pageTitle={pageTitle} />
    </div>
  );
}

export function PackageDependantsBreadCrumbs(
  props: PackageDependantsBreadCrumbsProps
) {
  const { community, packageName, packageNameSpace } = props;
  return (
    <div className={styles.root}>
      <DefaultHomeCrumb />
      <CommunitiesLink className={styles.outer}>
        <div className={styles.inner}>Communities</div>
      </CommunitiesLink>
      <CommunityLink community={community} className={styles.outer}>
        <div className={styles.inner}>{community}</div>
      </CommunityLink>
      <PackageLink
        community={community}
        package={packageName}
        namespace={packageNameSpace}
        className={styles.outer}
      >
        <div className={styles.inner}>{packageName}</div>
      </PackageLink>
      <PageTitleCrumb pageTitle="Dependants" />
    </div>
  );
}

export function TeamSettingsBreadCrumbs(props: BreadCrumbsProps) {
  const { pageTitle } = props;
  return (
    <div className={styles.root}>
      <DefaultHomeCrumb />
      <TeamsLink className={styles.outer}>
        <div className={styles.inner}>Teams</div>
      </TeamsLink>
      <PageTitleCrumb pageTitle={pageTitle} />
    </div>
  );
}
