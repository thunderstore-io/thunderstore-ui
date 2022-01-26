import { Heading } from "@chakra-ui/react";
import {
  BreadCrumbs,
  CommunityLink,
  PackageLink,
} from "@thunderstore/components";
import { GetServerSideProps } from "next";

import { Background } from "components/Background";
import { ContentWrapper } from "components/Wrapper";

interface PageProps {
  community: string;
  package: string;
}

export default function PackageDependantsPage(props: PageProps): JSX.Element {
  const { community, package: package_ } = props;

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <BreadCrumbs
          parts={[
            {
              LinkComponent: CommunityLink,
              LinkProps: { community },
              label: community,
            },
            {
              LinkComponent: PackageLink,
              LinkProps: { community, package: package_ },
              label: package_,
            },
            {
              label: "Dependants",
            },
          ]}
        />
        <Heading color="ts.orange">
          List of packages depending on {package_}
        </Heading>
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
      community: context.params.community,
      package: context.params.package,
    },
  };
};
