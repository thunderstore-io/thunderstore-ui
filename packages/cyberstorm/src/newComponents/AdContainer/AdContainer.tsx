import "./AdContainer.css";

export type AdContainerSizeVariant =
  | "display-300-250"
  // Fluid rail container; the rail uses two of these (see layout.css).
  | "dynamic"
  | "bottom-banner";

interface AdContainerProps {
  containerId: string;
  // Drives the slot's reserved box via a `data-size` attribute; see
  // AdContainer.css. Defaults to the legacy 300×250 display box.
  sizeVariant?: AdContainerSizeVariant;
}

// An unfilled slot reserves its box (so ads load without shifting the layout)
// but renders nothing visible — no border, no message. NitroPay mounts the
// creative into `.ad-container__content`; the box only becomes visible once an
// ad fills it.
export function AdContainer(props: AdContainerProps) {
  const { containerId, sizeVariant } = props;

  return (
    <div
      className="ad-container"
      data-cid={containerId}
      data-size={sizeVariant ?? "display-300-250"}
    >
      <div className="ad-container__content" id={containerId} />
    </div>
  );
}

AdContainer.displayName = "AdContainer";
