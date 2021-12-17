import { Heading } from "@chakra-ui/react";

import { Background } from "../components/Background";
import { ContentWrapper } from "../components/Wrapper";

export default function CommunityList(): JSX.Element {
  return (
    <>
      <Background url="https://api.lorem.space/image/game?w=2000&h=200" />
      <ContentWrapper>
        <Heading color="ts.orange">List of communities</Heading>
      </ContentWrapper>
    </>
  );
}
