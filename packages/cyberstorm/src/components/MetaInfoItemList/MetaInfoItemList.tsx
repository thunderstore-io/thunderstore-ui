import styles from "./MetaInfoItemList.module.css";
import React, { ReactElement } from "react";
import { MetaInfoItem } from "../MetaInfoItem/MetaInfoItem";

interface metaInfoData {
  key: string;
  label: string;
  content: ReactElement;
}
export type MetaInfoItemListProps = {
  metaInfoData?: Array<metaInfoData>;
};

/**
 * Cyberstorm FilterItemList
 */
export const MetaInfoItemList: React.FC<MetaInfoItemListProps> = (props) => {
  const { metaInfoData } = props;
  const metaItemList = metaInfoData?.map((metaInfoDataItem) => {
    return (
      <div key={metaInfoDataItem.key}>
        <MetaInfoItem
          label={metaInfoDataItem.label}
          content={metaInfoDataItem.content}
        />
      </div>
    );
  });
  return (
    <div>
      <div className={styles.root}></div>
      {metaItemList}
    </div>
  );
};

MetaInfoItemList.displayName = "MetaInfoItemList";
MetaInfoItemList.defaultProps = { metaInfoData: [] };
