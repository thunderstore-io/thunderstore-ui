import styles from "./MetaInfoItemList.module.css";
import { MetaInfoItem } from "../MetaInfoItem/MetaInfoItem";
import React, { ReactElement } from "react";

interface metaInfoData {
  key: string;
  label: string;
  content?: ReactElement;
}

export type MetaInfoItemListProps = {
  metaInfoData?: Array<metaInfoData>;
};

/**
 * Cyberstorm component for listing MetaInfoItems.
 */
export const MetaInfoItemList: React.FC<MetaInfoItemListProps> = (props) => {
  const { metaInfoData = [] } = props;
  const metaItemList = metaInfoData?.map((metaInfoDataItem) => {
    return (
      <MetaInfoItem
        key={metaInfoDataItem.key}
        label={metaInfoDataItem.label}
        content={metaInfoDataItem.content}
      />
    );
  });
  return (
    <div>
      <div className={styles.root}>{metaItemList}</div>
    </div>
  );
};

MetaInfoItemList.displayName = "MetaInfoItemList";
