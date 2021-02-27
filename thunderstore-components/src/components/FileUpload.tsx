import { chakra } from "@chakra-ui/react";
import React from "react";

export const FileUpload: React.FC<React.HTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  return <chakra.input type="file" name="file" {...props} />;
};
