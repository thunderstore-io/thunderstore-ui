import {
  PackageActions,
  PackageActionsProps,
  PackageDependency,
  PackageHeader,
  PackageHeaderProps,
  PackageInfo,
  PackageInfoProps,
  PackageRequirements,
  PackageVersion,
  PackageVersions,
} from "@thunderstore/components";
import { Dapper } from "@thunderstore/dapper";
import { useMediaQuery } from "@thunderstore/hooks";
import { GetServerSideProps } from "next";

import { Background } from "components/Background";
import {
  ContentWrapper,
  FULL_WIDTH_BREAKPOINT,
  LayoutWrapper,
} from "components/Wrapper";
import { API_DOMAIN } from "utils/constants";

interface PageProps
  extends PackageActionsProps,
    PackageHeaderProps,
    PackageInfoProps {
  requirements: PackageDependency[];
  versions: PackageVersion[];
}

export default function PackageDetailPage(props: PageProps): JSX.Element {
  const { markdown, packageName, requirements, versions } = props;
  const isFullWidth = useMediaQuery(`(min-width: ${FULL_WIDTH_BREAKPOINT})`);

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <LayoutWrapper variant="article">
          <PackageHeader {...props} renderFullWidth={!isFullWidth} />
        </LayoutWrapper>
        <LayoutWrapper variant="aside">
          <PackageActions {...props} renderFullWidth={!isFullWidth} />
        </LayoutWrapper>
        <LayoutWrapper variant="article">
          <PackageInfo markdown={markdown} />
        </LayoutWrapper>
        <LayoutWrapper variant="aside">
          <PackageRequirements requirements={requirements} mb="30px" />
          <PackageVersions packageName={packageName} versions={versions} />
        </LayoutWrapper>
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const communityIdentifier = context.params?.community;

  if (!communityIdentifier || Array.isArray(communityIdentifier)) {
    return { notFound: true };
  }

  const packageName = context.params?.package;

  if (!packageName || Array.isArray(packageName)) {
    return { notFound: true };
  }

  const dapper = new Dapper(API_DOMAIN);
  const props = await dapper.getPackage(communityIdentifier, packageName);
  return { props };
};
