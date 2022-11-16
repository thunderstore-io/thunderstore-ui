import React, { ReactNode } from "react";
import styles from "./componentStyles/MetaItem.module.css";

export interface MetaItemProps {
  label?: string;
  icon?: ReactNode;
  metaItemStyle?: string;
}

/**
 * Cyberstorm MetaItem component
 */
export const MetaItem: React.FC<MetaItemProps> = (props) => {
  const { label, icon, metaItemStyle } = props;
  styles; //if styles is not called, the classes from the css module aren't found
  const additionalStyle = metaItemStyle
    ? " metaItem__" + metaItemStyle
    : " metaItem__default";

  return (
    <div className={"metaItem" + additionalStyle}>
      {icon}
      {label ? <div className="metaItemLabel">{label}</div> : null}
    </div>
  );
};
