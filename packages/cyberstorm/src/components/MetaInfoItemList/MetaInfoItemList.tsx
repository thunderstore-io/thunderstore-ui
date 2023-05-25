import React from "react";
import styles from "./MetaInfoItemList.module.css";
import { MetaInfoItem, MetaInfoItemProps } from "../MetaInfoItem/MetaInfoItem";

export type MetaInfoItemListProps = {
  items?: Array<MetaInfoItemProps>;
};

/**
 * Cyberstorm component for listing MetaInfoItems.
 */
export const MetaInfoItemList: React.FC<MetaInfoItemListProps> = (props) => (
  <div className={styles.root}>
    {props.items?.map((metaInfoItem, i) => (
      <MetaInfoItem key={`${metaInfoItem.label}-${i}`} {...metaInfoItem} />
    ))}
  </div>
);

MetaInfoItemList.displayName = "MetaInfoItemList";
MetaInfoItemList.defaultProps = { items: [] };
