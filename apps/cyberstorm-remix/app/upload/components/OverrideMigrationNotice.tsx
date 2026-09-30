import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";

import { NewAlert, NewButton, useToast } from "@thunderstore/cyberstorm";
import {
  extractApiErrorMessage,
  isApiError,
  postPackageVersionReadme,
} from "@thunderstore/thunderstore-api";

import {
  type PreviousOverride,
  downloadOverrideText,
  findPreviousReadmeOverride,
} from "../../p/readmeEdit/overrideMigration";
import type { OutletContextShape } from "../../root";

export interface OverrideMigrationNoticeProps {
  namespace: string;
  packageName: string;
  newVersion: string;
  /** The override the upload form offered and the submitter opted to carry.
      It is copied on mount, and the manual offer remains as the fallback if
      that fails. */
  overrideToCarry?: PreviousOverride | null;
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
  overrideToCarry,
}: OverrideMigrationNoticeProps) {
  const outletContext = useOutletContext() as OutletContextShape;
  const toast = useToast();

  const [previousOverride, setPreviousOverride] = useState(
    overrideToCarry ?? null
  );
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const carryAttempted = useRef(false);

  useEffect(() => {
    if (overrideToCarry) return;
    let cancelled = false;
    findPreviousReadmeOverride(
      outletContext.requestConfig,
      namespace,
      packageName,
      newVersion
    )
      .then((result) => {
        if (!cancelled) setPreviousOverride(result);
      })
      .catch(() => {
        // The notice is best-effort. A probe failure must not break the
        // submission result page.
      });
    return () => {
      cancelled = true;
    };
  }, [namespace, packageName, newVersion, overrideToCarry]);

  async function copyReadme(override: PreviousOverride) {
    setCopying(true);
    try {
      await postPackageVersionReadme({
        config: outletContext.requestConfig,
        params: { namespace, package: packageName, version: newVersion },
        data: { readme: override.markdown },
        queryParams: {},
      });
      toast.addToast({
        csVariant: "success",
        children:
          "Site-edited README carried over. Changes might take several minutes to show publicly!",
        duration: 8000,
      });
      setCopied(true);
    } catch (error) {
      toast.addToast({
        csVariant: "danger",
        children: `Carrying the edit over failed: ${
          isApiError(error) ? extractApiErrorMessage(error) : "unknown error"
        }`,
        duration: 8000,
      });
    } finally {
      setCopying(false);
    }
  }

  useEffect(() => {
    if (!overrideToCarry || carryAttempted.current) return;
    carryAttempted.current = true;
    copyReadme(overrideToCarry);
  }, [overrideToCarry]);

  if (!previousOverride || copied) return null;

  return (
    <NewAlert csVariant="info">
      <div className="override-migration-notice">
        <span>
          Version {newVersion} uses the README included in your package. Version{" "}
          {previousOverride.versionNumber} still has its edited README. You can
          copy that README to this version’s Thunderstore page.
        </span>
        <span className="override-migration-notice__actions">
          <NewButton
            csSize="small"
            csVariant="accent"
            onClick={() => copyReadme(previousOverride)}
            disabled={copying}
          >
            {copying ? "Copying…" : "Copy edited README"}
          </NewButton>
          <NewButton
            csSize="small"
            csVariant="secondary"
            onClick={() => downloadOverrideText(previousOverride.markdown)}
            disabled={copying}
          >
            Download edited README
          </NewButton>
        </span>
      </div>
    </NewAlert>
  );
}
