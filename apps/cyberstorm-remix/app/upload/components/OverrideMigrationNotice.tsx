import { useEffect, useRef, useState } from "react";
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
  /** Carry the edit over on mount, as opted into on the upload form. The
      manual offer remains as the fallback if the carry fails. */
  autoCarry?: boolean;
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
  autoCarry,
}: OverrideMigrationNoticeProps) {
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();

  const [previous, setPrevious] = useState<PreviousOverride | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const autoCarryAttempted = useRef(false);

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
        // The notice is best-effort. A probe failure must not break the
        // submission result page.
      });
    return () => {
      cancelled = true;
    };
  }, [namespace, packageName, newVersion]);

  const keep = async (override: PreviousOverride) => {
    setBusy(true);
    try {
      await migrateReadmeOverride(
        outletContext.requestConfig,
        namespace,
        packageName,
        newVersion,
        override.markdown
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

  useEffect(() => {
    if (!autoCarry || !previous || autoCarryAttempted.current) return;
    autoCarryAttempted.current = true;
    keep(previous);
  }, [autoCarry, previous]);

  if (!previous || done) return null;

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
            onClick={() => keep(previous)}
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
