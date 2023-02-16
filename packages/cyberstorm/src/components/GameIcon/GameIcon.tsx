import React from "react";
import styles from "./GameIcon.module.css";

export interface GameIconProps {
  imageSrc?: string;
}

/**
 * Cyberstorm Title component
 */
export const GameIcon: React.FC<GameIconProps> = (props) => {
  const { imageSrc } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"gameIcon"} src={imageSrc} />
    </div>
  );
};

GameIcon.displayName = "GameIcon";
GameIcon.defaultProps = { imageSrc: "/images/game.jpg" };
