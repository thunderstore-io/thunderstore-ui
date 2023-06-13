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

import { Background } from "components/Background";
import {
  ContentWrapper,
  FULL_WIDTH_BREAKPOINT,
  LayoutWrapper,
} from "components/Wrapper";
import { useFreshProps, WithDid404, withSoft404 } from "hooks/useFreshProps";
import { API_DOMAIN } from "utils/constants";
import { getString } from "utils/urlQuery";

type DapperResponse = Awaited<ReturnType<Dapper["getOldPackage"]>>;
type PageProps = WithDid404<DapperResponse>;

export default function PackageDetailPage(props_: PageProps): JSX.Element {
  const { communityIdentifier, namespace, packageName } = props_;

  if (
    communityIdentifier === undefined ||
    namespace === undefined ||
    packageName === undefined
  ) {
    throw new Error("404: Undefined URL parameter(s)");
  }

  const dapper = useDapper();
  const props = useFreshProps(props_, dapper.getOldPackage.bind(dapper), [
    communityIdentifier,
    namespace,
    packageName,
  ]);
  const { coverImage, markdown, requirements, versions } = props;
  const isFullWidth = useMediaQuery(`(min-width: ${FULL_WIDTH_BREAKPOINT})`);

  // Don't render anything while useFreshProps is checking if the page
  // can be accessed as authenticated user. It will either update
  // props.did404 or throw an error, so this rendering should be temporary.
  if (props.did404) {
    return <span />;
  }

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

const getServerSideProps_: GetServerSideProps = async (context) => {
  const communityIdentifier = getString(context.params?.communityIdentifier);
  const namespace = getString(context.params?.namespace);
  const packageName = getString(context.params?.packageName);

  if (
    communityIdentifier === undefined ||
    namespace === undefined ||
    packageName === undefined
  ) {
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

const urlParams = ["communityIdentifier", "namespace", "packageName"];
export const getServerSideProps = withSoft404(getServerSideProps_, urlParams);
