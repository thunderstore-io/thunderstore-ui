import {
  PackageActions,
  PackageHeader,
  PackageInfo,
  PackageRequirements,
  PackageVersions,
} from "@thunderstore/components";
import { useMediaQuery } from "@thunderstore/hooks";
import { GetServerSideProps } from "next";

import { Background } from "components/Background";
import {
  ContentWrapper,
  FULL_WIDTH_BREAKPOINT,
  LayoutWrapper,
} from "components/Wrapper";
import { fakeData } from "placeholder/packageDetails";
import { PackageProps, packageToProps } from "utils/transforms/package";

interface PageProps {
  package: PackageProps;
}

export default function PackageDetailPage(props: PageProps): JSX.Element {
  const pkg = props.package;
  const isFullWidth = useMediaQuery(`(min-width: ${FULL_WIDTH_BREAKPOINT})`);

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <LayoutWrapper variant="article">
          <PackageHeader {...pkg} renderFullWidth={!isFullWidth} />
        </LayoutWrapper>
        <LayoutWrapper variant="aside">
          <PackageActions {...pkg} renderFullWidth={!isFullWidth} />
        </LayoutWrapper>
        <LayoutWrapper variant="article">
          <PackageInfo {...pkg} />
        </LayoutWrapper>
        <LayoutWrapper variant="aside">
          <PackageRequirements requirements={pkg.requirements} mb="30px" />
          <PackageVersions {...pkg} />
        </LayoutWrapper>
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: validate the community & package exist in database.
  if (!context.params?.community || !context.params?.package) {
    return { notFound: true };
  }

  return {
    props: {
      package: packageToProps(fakeData),
    },
  };
};
