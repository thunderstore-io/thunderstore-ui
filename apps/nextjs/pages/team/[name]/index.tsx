import { BreadCrumbs } from "@thunderstore/components";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { Background } from "components/Background";
import { ContentWrapper } from "components/Wrapper";

export default function TeamProfilePage(): JSX.Element {
  const { query } = useRouter();
  const name = query.name as string;

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <BreadCrumbs parts={[{ label: name }]} />
      </ContentWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: validate the team exists in database.
  if (!context.params?.name) {
    return { notFound: true };
  }

  return {
    props: {
      name: context.params.name,
    },
  };
};
