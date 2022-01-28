/**
 * Collection of small, shared components intended for internal use.
 */
import { Flex, Image } from "@chakra-ui/react";
import React from "react";

import { QuestionMarkIcon } from "./Icons";

interface MaybeImageProps {
  borderRadius?: string;
  height: string;
  imageSrc: string | null;
}

/**
 * Show image or a placeholder.
 */
export const MaybeImage: React.FC<MaybeImageProps> = (props) => {
  const { borderRadius, height, imageSrc } = props;

  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        role="presentation"
        borderRadius={borderRadius ?? 0}
        h={height}
        objectFit="cover"
        w="100%"
      />
    );
  }

  return (
    <Flex align="center" bg="#0e1832" h={height} justify="center">
      <QuestionMarkIcon color="ts.lightBlue" h="50px" w="25px" />
    </Flex>
  );
};
