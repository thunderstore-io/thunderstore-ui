import styles from "./AdContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon/Icon";

interface AdContainerProps {
  containerId: string;
  noHeader?: boolean;
}

export function AdContainer(props: AdContainerProps) {
  const { containerId, noHeader = false } = props;

  return (
    <div className={styles.root}>
      {noHeader ? null : (
        <div className={styles.header}>
          <p className={styles.adTitle}>AD</p>
        </div>
      )}
      <div className={styles.fallback}>
        <p className={styles.adText}>
          Thunderstore development is made possible with ads.
        </p>
        <p className={styles.adThanks}>
          <Icon noWrapper inline iconClasses={styles.icon}>
            <FontAwesomeIcon icon={faHeart} />
          </Icon>
          Thanks
          <Icon noWrapper inline iconClasses={styles.icon}>
            <FontAwesomeIcon icon={faHeart} />
          </Icon>
        </p>
      </div>
      <div className={styles.content}>
        <div id={containerId} />
      </div>
    </div>
  );
}

AdContainer.displayName = "AdContainer";
