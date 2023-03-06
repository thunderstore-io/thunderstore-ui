import React from "react";
import styles from "./Avatar.module.css";

export interface AvatarProps {
  src?: string;
}

/**
 * Cyberstorm Avatar component
 */
export const Avatar: React.FC<AvatarProps> = (props) => {
  const { src } = props;
  return (
    <div className={styles.root}>
      <img className={styles.image} alt={"Avatar"} src={src} />
    </div>
  );
};

Avatar.displayName = "Avatar";
Avatar.defaultProps = { src: "/images/game.png" };
