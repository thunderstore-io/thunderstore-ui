import styles from "./Container.module.css";
import React from "react";
import {
  Frame,
  FrameWindowProps,
} from "../../../primitiveComponents/Frame/Frame";
import { classnames } from "../../../utils/utils";

export const Container = React.forwardRef<
  HTMLDivElement,
  Omit<FrameWindowProps, "primitiveType">
>((props: Omit<FrameWindowProps, "primitiveType">, forwardedRef) => {
  const {
    children,
    rootClasses,
    csColor = "purple",
    csSize = "m",
    csVariant = "primary",
    csMode = "auto",
    csWeight = "medium",
    ...forwardedProps
  } = props;
  const fProps = forwardedProps as FrameWindowProps;
  return (
    <Frame
      {...fProps}
      primitiveType={"window"}
      rootClasses={classnames(styles.container, rootClasses)}
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

Container.displayName = "Container";
