import React, { ReactNode } from "react";
import styles from "./MetaInfoItemList.module.css";
import { MetaInfoItem } from "../MetaInfoItem/MetaInfoItem";

type Props = {
  items: {
    key: string;
    label: string;
    content?: ReactNode;
  }[];
};

/**
 * Cyberstorm component for listing MetaInfoItems.
 */
export const MetaInfoItemList: React.FC<Props> = (props) => (
  <div className={styles.root}>
    {props.items.map((item) => (
      <MetaInfoItem {...item} key={item.key} />
    ))}
  </div>
);

MetaInfoItemList.displayName = "MetaInfoItemList";
