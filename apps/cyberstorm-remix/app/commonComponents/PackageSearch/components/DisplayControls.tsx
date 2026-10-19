import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronDown,
  faList,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  faArrowsLeftRightToLine,
  faGrid,
  faRectangleWide,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import {
  NewButton,
  NewDropDown,
  NewDropDownRadioGroup,
  NewDropDownRadioItem,
  NewIcon,
  classnames,
} from "@thunderstore/cyberstorm";

import "./DisplayControls.css";

type CardLayout = "grid" | "list";
type ContentWidth = "compact" | "wide";

interface DisplayOption<T extends string> {
  value: T;
  label: string;
  icon: IconDefinition;
}

const CARD_OPTIONS: DisplayOption<CardLayout>[] = [
  { value: "grid", label: "Grid", icon: faGrid },
  { value: "list", label: "List", icon: faList },
];

const WIDTH_OPTIONS: DisplayOption<ContentWidth>[] = [
  { value: "compact", label: "Compact", icon: faSquare },
  { value: "wide", label: "Wide", icon: faRectangleWide },
];

interface DisplayMenuProps<T extends string> {
  ariaLabel: string;
  header: string;
  // Distinguishes the two menus for the CSS that mirrors the html attribute.
  name: "cards" | "view";
  options: DisplayOption<T>[];
  // By default, the trigger icon is the selected option's icon.
  triggerIcon?: IconDefinition;
  value: T;
  onSelect: (value: T) => void;
}

function DisplayMenu<T extends string>(props: DisplayMenuProps<T>) {
  return (
    <NewDropDown
      contentAlignment="end"
      trigger={
        <NewButton
          csVariant="secondary"
          aria-label={props.ariaLabel}
          rootClasses={classnames(
            "display-controls__trigger",
            `display-controls__trigger--${props.name}`
          )}
        >
          {/* All icons render; CSS reveals the active one — see
              DisplayControls.css. */}
          {props.options.map((option) => (
            <NewIcon
              key={option.value}
              csMode="inline"
              noWrapper
              rootClasses={`display-controls__trigger-icon display-controls__trigger-icon--${option.value}`}
            >
              <FontAwesomeIcon icon={props.triggerIcon ?? option.icon} />
            </NewIcon>
          ))}
          <NewIcon
            csMode="inline"
            noWrapper
            rootClasses="display-controls__chevron"
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </NewIcon>
        </NewButton>
      }
    >
      <div className="display-controls__header">{props.header}</div>
      <NewDropDownRadioGroup
        value={props.value}
        onValueChange={(next) => props.onSelect(next as T)}
      >
        {props.options.map((option) => (
          <NewDropDownRadioItem key={option.value} value={option.value}>
            <button type="button">
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={option.icon} />
              </NewIcon>
              {option.label}
            </button>
          </NewDropDownRadioItem>
        ))}
      </NewDropDownRadioGroup>
    </NewDropDown>
  );
}

/**
 * Grid⇄List and Compact⇄Wide display preferences for the package search.
 *
 * Both preferences live on <html> data attributes (set pre-hydration from
 * localStorage in root.tsx) and drive the layout purely through CSS:
 * data-card-layout reflows the cards (CardPackage.css + PackageSearch.css) and
 * data-content-width drives --content-max (layout.css). The trigger icon
 * mirrors the html attribute too, so there is no flash or mismatch between SSR
 * and the client. The menu's checked row is React state, synced from that
 * attribute after mount, because the menu is closed until the user opens it.
 * Selecting an option writes the attribute and localStorage.
 */
export function DisplayControls() {
  const [cardLayout, setCardLayout] = useState<CardLayout>("grid");
  const [contentWidth, setContentWidth] = useState<ContentWidth>("compact");

  useEffect(() => {
    const root = document.documentElement;
    setCardLayout(root.dataset.cardLayout === "list" ? "list" : "grid");
    setContentWidth(root.dataset.contentWidth === "wide" ? "wide" : "compact");
  }, []);

  return (
    <div className="display-controls">
      <DisplayMenu
        ariaLabel="Card layout"
        header="Cards"
        name="cards"
        options={CARD_OPTIONS}
        value={cardLayout}
        onSelect={(value) => {
          setCardLayout(value);
          persist("nimbus-card-layout", value);
          setHtmlAttr("cardLayout", value === "list" ? "list" : undefined);
        }}
      />
      <DisplayMenu
        ariaLabel="Content width"
        header="View"
        name="view"
        options={WIDTH_OPTIONS}
        value={contentWidth}
        triggerIcon={faArrowsLeftRightToLine}
        onSelect={(value) => {
          setContentWidth(value);
          // Stored as "default"/"wide" to match the pre-hydration script.
          persist(
            "nimbus-content-width",
            value === "wide" ? "wide" : "default"
          );
          setHtmlAttr("contentWidth", value === "wide" ? "wide" : undefined);
        }}
      />
    </div>
  );
}

DisplayControls.displayName = "DisplayControls";

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable (private mode); the attribute still applies
    // for this session.
  }
}

function setHtmlAttr(name: "cardLayout" | "contentWidth", value?: string) {
  if (value) {
    document.documentElement.dataset[name] = value;
  } else {
    delete document.documentElement.dataset[name];
  }
}
