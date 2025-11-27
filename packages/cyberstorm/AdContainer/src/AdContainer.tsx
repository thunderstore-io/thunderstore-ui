import "./AdContainer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Icon as NewIcon } from "@thunderstore/cyberstorm-icon";

interface AdContainerProps {
  containerId: string;
}

export function AdContainer(props: AdContainerProps) {
  const { containerId } = props;

  return (
    <div className="ad-container">
      <div className="ad-container__fallback ad-container__fallback--variant--primary">
        Thunderstore development is made possible with ads. Please consider
        making an exception to your adblock.
        <NewIcon
          noWrapper
          csMode="inline"
          rootClasses="ad-container__icon"
          csVariant="danger"
        >
          <FontAwesomeIcon icon={faHeart} />
        </NewIcon>
      </div>
      <div className="ad-container__content" id={containerId} />
    </div>
  );
}

AdContainer.displayName = "AdContainer";
