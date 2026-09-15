import { type PackageListingOutletContext } from "app/p/packageListing";
import { useEffect } from "react";
import { useOutletContext } from "react-router";

/** Reports the rendered document's site-edit state up to the listing shell,
    which shows it as the "Edited" note in the tab strip. Renders nothing. */
export function DocEditedReporter(props: {
  doc: { is_edited?: boolean; edited_at?: string | null };
}) {
  const { setDocEdited } = useOutletContext<PackageListingOutletContext>();
  const { is_edited, edited_at } = props.doc;

  useEffect(() => {
    if (!setDocEdited) return;
    setDocEdited(is_edited ? { edited_at: edited_at ?? null } : null);
    return () => setDocEdited(null);
  }, [setDocEdited, is_edited, edited_at]);

  return null;
}
