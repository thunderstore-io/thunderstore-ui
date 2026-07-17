import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Icon as NewIcon } from "../Icon/Icon";
import "./AdContainer.css";

export type AdContainerSizeVariant =
  // 300×250 rectangle — the sidebar ads (community search + package listing).
  // Shows the house fallback while unfilled, like the bottom banner.
  | "display-300-250"
  // Rail skyscraper height tiers — one fixed-height box each. layout.css reveals
  // the tallest tier that fully fits the rail height (see the nimbus-ad-rail
  // rules), so the served ad is never clipped/below the fold.
  | "rail-300x600"
  | "rail-300x250"
  | "rail-300x100"
  | "bottom-banner";

interface AdContainerProps {
  containerId: string;
  // Drives the slot's reserved box via a `data-size` attribute; see
  // AdContainer.css. Defaults to the 300×250 box shape (the fallback markup
  // renders only when this is set explicitly — see showsFallback below).
  sizeVariant?: AdContainerSizeVariant;
  // Which route's rail this container belongs to. Both routes' rail tiers live in
  // the shared rail stack; the stack's data-rail-active-page + this marker let
  // layout.css show only the active route's set, so community and package rails
  // get distinct NitroPay ids (see nitroAds.ts).
  railPage?: "community" | "package";
}

// An unfilled slot reserves its box so ads load without shifting the layout.
// Most slots render nothing visible while empty; the bottom banner and the
// sidebar rectangles instead show a house "support us via ads" fallback
// (text + heart) — the spot to reach the users whose ad didn't fill or who run an
// adblocker. NitroPay mounts the creative into `.ad-container__content`, which
// overlays and hides the fallback once an ad fills (see the :has(iframe) rule in
// AdContainer.css).
export function AdContainer(props: AdContainerProps) {
  const { containerId, sizeVariant, railPage } = props;

  // The two reserved-box rectangles carry the house fallback; the rail and the
  // inline 300×250 display slot don't.
  const showsFallback =
    sizeVariant === "bottom-banner" || sizeVariant === "display-300-250";

  return (
    <div
      className="ad-container"
      data-cid={containerId}
      data-size={sizeVariant ?? "display-300-250"}
      data-rail-page={railPage}
    >
      {showsFallback ? (
        <div className="ad-container__fallback">
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
      ) : null}
      <div className="ad-container__content" id={containerId} />
    </div>
  );
}

AdContainer.displayName = "AdContainer";
