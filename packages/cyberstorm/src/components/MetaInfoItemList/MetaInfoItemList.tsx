import styles from "./MetaInfoItemList.module.css";
import { MetaInfoItem, MetaInfoItemProps } from "../MetaInfoItem/MetaInfoItem";

export type MetaInfoItemListProps = {
  items?: Array<MetaInfoItemProps>;
};

/**
 * Cyberstorm component for listing MetaInfoItems.
 */
export function MetaInfoItemList(props: MetaInfoItemListProps) {
  const { items = [] } = props;
  return (
    <div className={styles.root}>
      {items?.map((metaInfoItem, i) => (
        <MetaInfoItem key={`${metaInfoItem.label}-${i}`} {...metaInfoItem} />
      ))}
    </div>
  );
}

MetaInfoItemList.displayName = "MetaInfoItemList";
