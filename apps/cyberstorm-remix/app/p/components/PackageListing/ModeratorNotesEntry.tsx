import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { hasSessionCookie } from "cyberstorm/utils/gatedSsr";
import { useEffect, useMemo, useState } from "react";

import { useToast } from "@thunderstore/cyberstorm";
import {
  type RequestConfig,
  fetchCommunityPermissions,
  fetchPackagePermissions,
} from "@thunderstore/thunderstore-api";

import {
  ModeratorNotesForm,
  type ModeratorNotesTarget,
} from "./ModeratorNotesForm";

export interface ModeratorNotesEntryProps {
  target: ModeratorNotesTarget;
  toast: ReturnType<typeof useToast>;
}

async function fetchCanModerate(
  target: ModeratorNotesTarget,
  config: () => RequestConfig
): Promise<boolean> {
  if (target.type === "community") {
    const result = await fetchCommunityPermissions({
      config,
      queryParams: {},
      data: {},
      params: { community: target.communityId },
    });
    return result.permissions.can_moderate;
  }
  const result = await fetchPackagePermissions({
    config,
    queryParams: {},
    data: {},
    params: {
      community_id: target.communityId,
      namespace_id: target.namespaceId,
      package_name: target.packageId,
    },
  });
  return result.permissions.can_moderate;
}

/**
 * Self-contained moderator-notes button: it resolves the viewer's permission
 * client-side (the package/community pages don't carry it) and renders the form
 * only for moderators. Renders nothing for everyone else.
 */
export function ModeratorNotesEntry({
  target,
  toast,
}: ModeratorNotesEntryProps) {
  const [canModerate, setCanModerate] = useState(false);
  const targetKey = JSON.stringify(target);

  // Read the session straight from the cookie (like dapperSingleton) rather than
  // the route's requestConfig, which can still be anonymous when this mounts.
  const config = useMemo<() => RequestConfig>(
    () => () => getSessionTools().getConfig(),
    []
  );

  useEffect(() => {
    // Skip the request for anonymous viewers; only a session can moderate.
    if (!hasSessionCookie()) return;
    let cancelled = false;
    fetchCanModerate(target, config)
      .then((value) => {
        if (!cancelled) setCanModerate(value);
      })
      .catch(() => {
        // Not a moderator (403) or the request failed: leave the button hidden.
      });
    return () => {
      cancelled = true;
    };
  }, [targetKey, config]);

  if (!canModerate) return null;

  return <ModeratorNotesForm target={target} config={config} toast={toast} />;
}
