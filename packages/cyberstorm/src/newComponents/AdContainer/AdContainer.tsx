import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Icon as NewIcon } from "../Icon/Icon";
import "./AdContainer.css";

export type AdContainerSizeVariant =
  | "display-300-250"
  | "fishstick"
  | "dynamic"
  | "narrow-dynamic"
  | "video"
  | "bottom-banner"
  | "bottom-right";

interface AdContainerProps {
  containerId: string;
  // Drives the slot's reserved (fallback) size via a `data-size` attribute;
  // see AdContainer.css. Defaults to the legacy 300×250 display box.
  sizeVariant?: AdContainerSizeVariant;
}

export function AdContainer(props: AdContainerProps) {
  const { containerId, sizeVariant } = props;

  return (
    <div
      className="ad-container"
      data-cid={containerId}
      data-size={sizeVariant ?? "display-300-250"}
    >
      <div className="ad-container__fallback ad-container__fallback--variant--primary">
        {/* Slim/narrow variants hide the text and keep only the heart; see
            AdContainer.css. */}
        <span className="ad-container__fallback-text">
          Thunderstore development is made possible with ads. Please consider
          making an exception to your adblock.
        </span>
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
