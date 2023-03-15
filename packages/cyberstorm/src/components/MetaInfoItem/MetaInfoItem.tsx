import React, { ReactNode } from "react";
import styles from "./MetaInfoItem.module.css";

type _MetaInfoItemProps = {
  label?: string;
  icon?: ReactNode;
  colorScheme?: "default" | "tertiary";
  ref?: React.Ref<HTMLDivElement>;
};
export type MetaInfoItemProps = _MetaInfoItemProps &
  Omit<React.HTMLProps<HTMLDivElement>, keyof _MetaInfoItemProps>;

export const MetaInfoItem = React.forwardRef<HTMLDivElement, MetaInfoItemProps>(
  (props) => {
    const { colorScheme } = props;

    return (
      <div className={`${styles.root} ${getStyle(colorScheme)}`}>
        {props.children}
      </div>
    );
  }
);

MetaInfoItem.displayName = "MetaInfoItem";
MetaInfoItem.defaultProps = { colorScheme: "default" };

const getStyle = (scheme: MetaInfoItemProps["colorScheme"] = "default") => {
  return {
    tertiary: styles.metaInfoItem__tertiary,
    default: styles.metaInfoItem__default,
  }[scheme];
};
