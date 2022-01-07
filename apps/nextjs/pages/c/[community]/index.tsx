import { BreadCrumbs, CommunityPackagesLink } from "@thunderstore/components";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { Background } from "../../../components/Background";
import { ContentWrapper } from "../../../components/Wrapper";

export default function CommunityFrontPage(): JSX.Element {
  const { query } = useRouter();
  const community = query.community as string;

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <BreadCrumbs parts={[{ label: community }]} />
        <CommunityPackagesLink community={community}>
          Packages
        </CommunityPackagesLink>
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: validate the community exists in database.
  if (!context.params?.community) {
    return { notFound: true };
  }

  return {
    props: {
      community: context.params.community,
    },
  };
};
