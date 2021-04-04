import { ChakraProvider, ChakraProviderProps, CSSReset } from "@chakra-ui/react";
import React from "react";
import {
  ThunderstoreProvider,
  ThunderstoreProviderProps,
} from "./ThunderstoreProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

interface RootWrapperProps {
  theme: ChakraProviderProps["theme"];
  thunderstoreProviderValue: ThunderstoreProviderProps;
}

const queryClient = new QueryClient();

export const RootWrapper: React.FC<RootWrapperProps> = ({
  theme,
  thunderstoreProviderValue,
  children,
}) => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <ThunderstoreProvider value={thunderstoreProviderValue}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </QueryClientProvider>
      </ThunderstoreProvider>
    </ChakraProvider>
  );
};
