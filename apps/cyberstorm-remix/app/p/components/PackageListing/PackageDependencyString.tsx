import { useRef } from "react";

import { CopyButton } from "@thunderstore/cyberstorm";

import "./PackageDependencyString.css";

/**
 * Standalone dependency string: the full version name (truncated) in a boxed
 * field with a primary-styled copy action. Rendered above the meta list in the
 * package sidebar/drawer. A plain click selects the full string, but a manual
 * drag-selection of part of the text is left untouched.
 */
export function PackageDependencyString(props: { dependency: string }) {
  const valueRef = useRef<HTMLSpanElement>(null);

  const selectValue = () => {
    const el = valueRef.current;
    const selection = window.getSelection();
    if (!el || !selection) {
      return;
    }
    // The click that ends a drag-selection also fires onClick; if the user
    // highlighted a specific part by dragging, the selection isn't collapsed, so
    // leave their partial selection alone instead of expanding to the whole string.
    if (!selection.isCollapsed) {
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className="package-dependency-string" onClick={selectValue}>
      <span
        ref={valueRef}
        title={props.dependency}
        className="package-dependency-string__value"
      >
        {props.dependency}
      </span>
      {/* Stop propagation so copying doesn't also re-trigger the select. */}
      <div
        className="package-dependency-string__copy"
        onClick={(e) => e.stopPropagation()}
      >
        <CopyButton text={props.dependency} />
      </div>
    </div>
  );
}

PackageDependencyString.displayName = "PackageDependencyString";
