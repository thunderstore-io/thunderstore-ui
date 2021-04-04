declare module "chakra-ui-markdown-renderer" {
  import { ElementType } from "react";
  export default function ChakraUIRenderer(): { [nodeType: string]: ElementType };
}
