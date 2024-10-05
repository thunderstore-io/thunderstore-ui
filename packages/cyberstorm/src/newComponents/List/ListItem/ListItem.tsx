import styles from "./ListItem.module.css";
import React from "react";
import {
  Frame,
  FrameListItemProps,
} from "../../../primitiveComponents/Frame/Frame";
import { classnames } from "../../../utils/utils";

export const ListItem = React.forwardRef<
  HTMLLIElement,
  Omit<FrameListItemProps, "primitiveType">
>((props: Omit<FrameListItemProps, "primitiveType">, forwardedRef) => {
  const { children, rootClasses, ...forwardedProps } = props;
  const fProps = forwardedProps as FrameListItemProps;
  return (
    <Frame
      {...fProps}
      primitiveType={"listItem"}
      rootClasses={classnames(styles.listItem, rootClasses)}
      ref={forwardedRef}
    >
      {children}
    </Frame>
  );
});

ListItem.displayName = "ListItem";
