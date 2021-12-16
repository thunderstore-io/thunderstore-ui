import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Community(): JSX.Element {
  const router = useRouter();
  const { community } = router.query;

  return <Heading color="ts.orange">{community} community</Heading>;
}
