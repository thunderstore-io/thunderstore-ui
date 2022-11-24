import React, { ReactNode } from "react";
import styles from "./componentStyles/PackageFlag.module.css";

export interface PackageFlagProps {
  label?: string;
  icon?: ReactNode;
  packageFlagStyle?: string;
}

/**
 * Cyberstorm PackageFlag component
 */
export const PackageFlag: React.FC<PackageFlagProps> = (props) => {
  const { label, icon, packageFlagStyle } = props;
  styles; //if styles is not called, the classes from the css module aren't found
  const additionalStyle = packageFlagStyle
    ? " packageFlag__" + packageFlagStyle
    : " packageFlag__default";

  return (
    <button type="button" className={"packageFlag" + additionalStyle}>
      {icon}
      {label ? <div className="packageFlagLabel">{label}</div> : null}
    </button>
  );
};
