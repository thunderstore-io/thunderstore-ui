import React from "react";
import styles from "./ThunderstoreLogo.module.css";

export interface ThunderstoreLogoProps {
  src?: string;
}

/**
 * Cyberstorm ThunderstoreLogo component
 */
export const ThunderstoreLogo: React.FC<ThunderstoreLogoProps> = (props) => {
  const { src } = props;
  return (
    <div>
      <img className={styles.image} alt={"ThunderstoreLogo"} src={src} />
    </div>
  );
};

ThunderstoreLogo.displayName = "ThunderstoreLogo";
ThunderstoreLogo.defaultProps = { src: "/images/logo.png" };
