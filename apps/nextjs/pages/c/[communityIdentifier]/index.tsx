import { BreadCrumbs, CommunityPackagesLink } from "@thunderstore/components";
import { GetServerSideProps } from "next";

import { Background } from "components/Background";
import { ContentWrapper } from "components/Wrapper";
import { getString } from "utils/urlQuery";

interface PageProps {
  communityIdentifier: string;
}

export default function CommunityFrontPage(props: PageProps): JSX.Element {
  const { communityIdentifier } = props;

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <BreadCrumbs parts={[{ label: communityIdentifier }]} />
        <CommunityPackagesLink community={communityIdentifier}>
          Packages
        </CommunityPackagesLink>
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: validate the community exists in database.
  const communityIdentifier = getString(context.params?.communityIdentifier);

  if (communityIdentifier === undefined) {
    return { notFound: true };
  }

  return { props: { communityIdentifier } };
};