import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import { NewAlert, NewButton, useToast } from "@thunderstore/cyberstorm";
import { isApiError } from "@thunderstore/thunderstore-api";

import {
  type PreviousOverride,
  downloadOverrideText,
  findPreviousReadmeOverride,
  migrateReadmeOverride,
} from "../../p/readmeEdit/overrideMigration";
import type { OutletContextShape } from "../../root";

export interface OverrideMigrationNoticeProps {
  namespace: string;
  packageName: string;
  newVersion: string;
}

/**
 * Post-upload notice: when the previous version carried a site-edited README,
 * the new upload starts clean, so tell the submitter and offer to carry the
 * edit over or download it.
 */
export function OverrideMigrationNotice({
  namespace,
  packageName,
  newVersion,
}: OverrideMigrationNoticeProps) {
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();

  const [previous, setPrevious] = useState<PreviousOverride | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    findPreviousReadmeOverride(
      outletContext.requestConfig,
      namespace,
      packageName,
      newVersion
    )
      .then((result) => {
        if (!cancelled) setPrevious(result);
      })
      .catch(() => {
        // The notice is best-effort; a probe failure must not break the
        // submission result page.
      });
    return () => {
      cancelled = true;
    };
  }, [namespace, packageName, newVersion]);

  if (!previous || done) return null;

  const keep = async () => {
    setBusy(true);
    try {
      await migrateReadmeOverride(
        outletContext.requestConfig,
        namespace,
        packageName,
        newVersion,
        previous.markdown
      );
      toast.addToast({
        csVariant: "success",
        children:
          "Site-edited README carried over. It can take up to 15 minutes to appear for everyone else.",
        duration: 8000,
      });
      setDone(true);
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: `Carrying the edit over failed: ${
          isApiError(error) ? error.message : "unknown error"
        }`,
        duration: 8000,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <NewAlert csVariant="info">
      <div className="override-migration-notice">
        <span>
          Version {previous.versionNumber} has a site-edited README. This upload
          starts from the packaged file, so the edit is no longer shown.
        </span>
        <span className="override-migration-notice__actions">
          <NewButton
            csSize="small"
            csVariant="accent"
            onClick={keep}
            disabled={busy}
          >
            {busy ? "Carrying over…" : "Carry it over"}
          </NewButton>
          <NewButton
            csSize="small"
            csVariant="secondary"
            onClick={() => downloadOverrideText(previous.markdown)}
            disabled={busy}
          >
            Download it
          </NewButton>
        </span>
      </div>
    </NewAlert>
  );
}
