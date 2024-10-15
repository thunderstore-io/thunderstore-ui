import styles from "./AdContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Container, NewIcon } from "../..";

interface AdContainerProps {
  containerId: string;
}

export function AdContainer(props: AdContainerProps) {
  const { containerId } = props;

  return (
    <Container
      rootClasses={styles.root}
      csSize="s"
      csVariant="default"
      csColor="surface-alpha"
      csTextStyles={["fontWeightRegular", "fontSizeS", "lineHeightBody"]}
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
      <Container rootClasses={styles.content} id={containerId} />
    </Container>
  );
}

AdContainer.displayName = "AdContainer";
