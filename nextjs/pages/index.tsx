import { Box, Button, Heading, Text, useColorMode } from "@chakra-ui/react";

export default function Home(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box p={2}>
      <Heading as="h1">Hello, World!</Heading>
      <Text>Currently in {colorMode} mode</Text>
      <Button onClick={() => toggleColorMode()}>
        Switch to {colorMode === "light" ? "dark" : "light"} mode
      </Button>
    </Box>
  );
}
