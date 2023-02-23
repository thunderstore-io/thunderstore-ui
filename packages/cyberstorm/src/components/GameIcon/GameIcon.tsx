import React from "react";
import styles from "./GameIcon.module.css";

export interface GameIconProps {
  src?: string;
}

/**
 * Cyberstorm GameIcon component
 */
export const GameIcon: React.FC<GameIconProps> = (props) => {
  const { src } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"gameIcon"} src={src} />
    </div>
  );
};

GameIcon.displayName = "GameIcon";
GameIcon.defaultProps = { src: "/images/game.png" };
