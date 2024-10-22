import styles from "./AdContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { NewIcon } from "../..";
import { classnames } from "../../utils/utils";

interface AdContainerProps {
  containerId: string;
}

export function AdContainer(props: AdContainerProps) {
  const { containerId } = props;

  return (
    <div
      className={classnames(
        styles.root,
        "fontWeightRegular",
        "fontSizeS",
        "lineHeightBody"
      )}
    >
      <div className={styles.fallback}>
        Thunderstore development is made possible with ads. Please consider
        making an exception to your adblock.
        <NewIcon
          noWrapper
          csMode="inline"
          rootClasses={styles.icon}
          csColor="red"
          csVariant="default"
        >
          <FontAwesomeIcon icon={faHeart} />
        </NewIcon>
      </div>
      <div className={styles.content} id={containerId} />
    </div>
  );
}

AdContainer.displayName = "AdContainer";
