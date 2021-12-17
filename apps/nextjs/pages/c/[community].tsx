import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Background } from "../../components/Background";
import { ContentWrapper } from "../../components/Wrapper";

export default function Community(): JSX.Element {
  const router = useRouter();
  const { community } = router.query;

  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <Heading color="ts.orange">{community} community</Heading>
      </ContentWrapper>
    </>
  );
}
