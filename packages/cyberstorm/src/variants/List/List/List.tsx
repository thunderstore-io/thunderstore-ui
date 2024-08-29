import styles from "./List.module.css";
import React from "react";
import {
  Frame,
  FrameListProps,
} from "../../../primitiveComponents/Frame/Frame";
import { classnames } from "../../../utils/utils";

export const List = React.forwardRef<
  HTMLUListElement,
  Omit<FrameListProps, "primitiveType">
>((props: Omit<FrameListProps, "primitiveType">, forwardedRef) => {
  const {
    children,
    rootClasses,
    csColor = "purple",
    csSize = "s",
    csVariant = "accent",
    csMode = "body",
    csWeight = "regular",
    ...forwardedProps
  } = props;
  const fProps = forwardedProps as FrameListProps;
  return (
    <Frame
      {...fProps}
      primitiveType={"list"}
      rootClasses={classnames(styles.list, rootClasses)}
      csColor={csColor}
      csSize={csSize}
      csVariant={csVariant}
      csMode={csMode}
      csWeight={csWeight}
      ref={forwardedRef}
    >
      {children}
    </Frame>
  );
});

List.displayName = "List";
