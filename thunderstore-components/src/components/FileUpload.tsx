import React from "react";

export const FileUpload: React.FC<React.HTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  return <input type="file" name="file" {...props} />;
};
