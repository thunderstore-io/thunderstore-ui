import { Heading } from "@chakra-ui/react";
import {
  BreadCrumbs,
  CommunityLink,
  PackageLink,
} from "@thunderstore/components";
import { GetServerSideProps } from "next";

import { Background } from "components/Background";
import { ContentWrapper } from "components/Wrapper";
import { getString } from "utils/urlQuery";

interface PageProps {
  communityIdentifier: string;
  namespace: string;
  packageName: string;
}

export default function PackageDependantsPage(props: PageProps): JSX.Element {
  const { communityIdentifier, namespace, packageName } = props;

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <BreadCrumbs
          parts={[
            {
              LinkComponent: CommunityLink,
              LinkProps: { community: communityIdentifier },
              label: communityIdentifier,
            },
            {
              LinkComponent: PackageLink,
              LinkProps: {
                community: communityIdentifier,
                namespace,
                package: packageName,
              },
              label: packageName,
            },
            {
              label: "Dependants",
            },
          ]}
        />
        <Heading color="ts.orange">
          List of packages depending on {packageName}
        </Heading>
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: validate the community & package exist in database.
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

  return {
    props: {
      communityIdentifier,
      namespace,
      packageName,
    },
  };
};