import React from "react";
import styles from "./ModIcon.module.css";

export interface ModIconProps {
  src?: string;
}

/**
 * Cyberstorm ModIcon component
 */
export const ModIcon: React.FC<ModIconProps> = (props) => {
  const { src } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"ModIcon"} src={src} />
    </div>
  );
};

ModIcon.displayName = "ModIcon";
ModIcon.defaultProps = { src: "/images/game.png" };
