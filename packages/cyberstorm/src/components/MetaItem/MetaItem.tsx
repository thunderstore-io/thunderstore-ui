import styles from "./MetaItem.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

export interface MetaItemProps {
  label?: string;
  icon?: JSX.Element;
  colorScheme?: "default" | "accent" | "tertiary";
  size?: "medium" | "large" | "bold_large";
}

/**
 * Cyberstorm MetaItem component
 * Used for displaying a single data point (e.g. an amount
 * of likes or a size of a package) with an icon next to it
 */
export function MetaItem(props: MetaItemProps) {
  const { label, icon, colorScheme = "default", size = "medium" } = props;

  return (
    <div className={classnames(styles.root, getStyle(colorScheme))}>
      <Icon inline wrapperClasses={styles.icon}>
        {icon}
      </Icon>
      {label ? (
        <div className={classnames(styles.label, getSize(size))}>{label}</div>
      ) : null}
    </div>
  );
}

MetaItem.displayName = "MetaItem";

const getStyle = (scheme: MetaItemProps["colorScheme"] = "default") => {
  return {
    default: styles.metaItem__default,
    accent: styles.metaItem__accent,
    tertiary: styles.metaItem__tertiary,
  }[scheme];
};

const getSize = (scheme: MetaItemProps["size"] = "medium") => {
  return {
    medium: styles.metaItem__medium,
    large: styles.metaItem__large,
    bold_large: styles.metaItem__bold_large,
  }[scheme];
};
