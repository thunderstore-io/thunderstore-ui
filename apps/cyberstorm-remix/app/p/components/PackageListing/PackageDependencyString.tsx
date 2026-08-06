import { CopyButton } from "@thunderstore/cyberstorm";

import "./PackageDependencyString.css";

/**
 * Standalone dependency string: the full version name in a boxed field with a
 * copy action. Rendered above the meta list in the package sidebar/drawer.
 * A plain click selects the full string; a drag-selection of part of the text
 * is left untouched. Uses a readonly input so selection is a native control
 * (satisfies jsx-a11y — no click handler on a non-interactive div).
 */
export function PackageDependencyString(props: { dependency: string }) {
  return (
    <div className="package-dependency-string">
      <input
        type="text"
        readOnly
        value={props.dependency}
        title={props.dependency}
        aria-label="Dependency string"
        className="package-dependency-string__value"
        onClick={(e) => {
          const el = e.currentTarget;
          // The click that ends a drag-selection also fires onClick; if the user
          // highlighted a range, leave it alone instead of selecting everything.
          if (el.selectionStart !== el.selectionEnd) {
            return;
          }
          el.select();
        }}
      />
      <div className="package-dependency-string__copy">
        <CopyButton text={props.dependency} />
      </div>
    </div>
  );
}

PackageDependencyString.displayName = "PackageDependencyString";
