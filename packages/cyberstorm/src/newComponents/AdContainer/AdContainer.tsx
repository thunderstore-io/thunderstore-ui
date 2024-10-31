import "./AdContainer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { NewIcon } from "../..";

interface AdContainerProps {
  containerId: string;
}

export function AdContainer(props: AdContainerProps) {
  const { containerId } = props;

  return (
    <div className="ts-adcontainer">
      <div className="ts-adcontainer__fallback ts-variant--primary">
        Thunderstore development is made possible with ads. Please consider
        making an exception to your adblock.
        <NewIcon
          noWrapper
          csMode="inline"
          rootClasses="ts-adcontainer__icon"
          csVariant="danger"
        >
          <FontAwesomeIcon icon={faHeart} />
        </NewIcon>
      </div>
      <div className="ts-adcontainer__content" id={containerId} />
    </div>
  );
}

AdContainer.displayName = "AdContainer";
