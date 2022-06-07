import {
  PackageActions,
  PackageHeader,
  PackageInfo,
  PackageRequirements,
  PackageVersions,
} from "@thunderstore/components";
import { Dapper, useDapper } from "@thunderstore/dapper";
import { useMediaQuery } from "@thunderstore/hooks";
import { GetServerSideProps } from "next";
import { useState } from "react";

import { Background } from "components/Background";
import {
  ContentWrapper,
  FULL_WIDTH_BREAKPOINT,
  LayoutWrapper,
} from "components/Wrapper";
import { useFreshProps } from "hooks/useFreshProps";
import { API_DOMAIN } from "utils/constants";

type PageProps = Awaited<ReturnType<Dapper["getPackage"]>>;

export default function PackageDetailPage(props_: PageProps): JSX.Element {
  const [props, setProps] = useState(props_);
  const dapper = useDapper();
  useFreshProps(setProps, dapper.getPackage.bind(dapper), [
    props_.communityIdentifier,
    props_.namespace,
    props_.packageName,
  ]);
  const { coverImage, markdown, packageName, requirements, versions } = props;
  const isFullWidth = useMediaQuery(`(min-width: ${FULL_WIDTH_BREAKPOINT})`);

  return (
    <>
      <Background url={coverImage} />
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
  const communityIdentifier = context.params?.communityIdentifier;

  if (!communityIdentifier || Array.isArray(communityIdentifier)) {
    return { notFound: true };
  }

  const namespace = context.params?.namespace;

  if (!namespace || Array.isArray(namespace)) {
    return { notFound: true };
  }

  const packageName = context.params?.packageName;

  if (!packageName || Array.isArray(packageName)) {
    return { notFound: true };
  }

  const dapper = new Dapper(API_DOMAIN);
  const props = await dapper.getPackage(
    communityIdentifier,
    namespace,
    packageName
  );
  return { props };
};
