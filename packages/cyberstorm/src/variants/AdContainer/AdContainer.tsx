import styles from "./AdContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../../variants/Container/Container/Container";
import { Icon } from "../..";

interface AdContainerProps {
  containerId: string;
}

export function AdContainer(props: AdContainerProps) {
  const { containerId } = props;

  return (
    <Container
      rootClasses={styles.root}
      csSize="s"
      csVariant="secondary"
      csTextStyles={["fontWeightRegular"]}
    >
      <div className={styles.fallback}>
        Thunderstore development is made possible with ads.
        <Icon noWrapper inline iconClasses={styles.icon}>
          <FontAwesomeIcon icon={faHeart} />
        </Icon>
        Thanks
        <Icon noWrapper inline iconClasses={styles.icon}>
          <FontAwesomeIcon icon={faHeart} />
        </Icon>
      </div>
      <Container rootClasses={styles.content} id={containerId} />
    </Container>
  );
}

AdContainer.displayName = "AdContainer";
