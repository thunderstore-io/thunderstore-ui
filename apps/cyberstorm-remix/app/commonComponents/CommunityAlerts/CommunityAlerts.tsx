import type { ReactNode } from "react";

import { NewAlert, NewLink } from "@thunderstore/cyberstorm";
import type { AlertVariants } from "@thunderstore/cyberstorm-theme";

import "./CommunityAlerts.css";

interface CommunityAlertConfig {
  /** Stable React key. */
  id: string;
  csVariant: AlertVariants;
  /**
   * Whether the live Django site lets visitors dismiss this alert. Not acted on
   * yet — alerts render non-dismissible for now. Dismissal (and the
   * pre-hydration, shift-free machinery it needs) lands in a later PR; the flag
   * is kept so that PR already has the correct per-alert mapping.
   */
  dismissible: boolean;
  content: ReactNode;
}

/**
 * Hard-coded community alerts, gated by community identifier.
 *
 * These mirror the `content_beginning` DynamicHTML entries the live Django site
 * renders per community (filtered via `require_communities`). Nimbus has no API
 * for them yet, so — like CommunityPromo — adding or editing an alert is a data
 * change here. The "Get the Thunderstore App" promo that also lives in that
 * placement is intentionally excluded; it is global, not a community alert.
 */
const AI_GENERATED_ALERT: CommunityAlertConfig = {
  id: "Alert-Multiple-AIGenerated",
  csVariant: "warning",
  dismissible: true,
  content:
    "Please disclose if any significant portion of your mod was created using AI tools by adding the 'AI Generated' category. Failing to do so may result in the mod being removed from Thunderstore.",
};

const COMMUNITY_ALERTS: Record<string, readonly CommunityAlertConfig[]> = {
  "lethal-company": [AI_GENERATED_ALERT],
  valheim: [AI_GENERATED_ALERT],
  riskofrain2: [AI_GENERATED_ALERT],
  repo: [AI_GENERATED_ALERT],
  "hollow-knight-silksong": [AI_GENERATED_ALERT],
  boneworks: [
    {
      id: "boneworks-melonloader",
      csVariant: "warning",
      dismissible: false,
      content:
        "Latest versions of MelonLoader are known to have issues with some games. Use version 0.5.4 until the issue has been fixed!",
    },
  ],
  "schedule-i": [
    {
      id: "schedule-i-mono",
      csVariant: "warning",
      dismissible: false,
      content:
        'Some mods target the Mono version of the game, which is available by opting into the Steam beta branch "alternate"',
    },
  ],
  "bopl-battle": [
    {
      id: "bopl-battle-2-4-3",
      csVariant: "warning",
      dismissible: false,
      content: (
        <>
          Due to update 2.4.3, some mods may no longer function.{" "}
          <NewLink
            primitiveType="link"
            href="/c/bopl-battle/p/Jo912345/FixedConfig/"
            csVariant="primary"
          >
            FixedConfig
          </NewLink>{" "}
          may be necessary.
        </>
      ),
    },
  ],
  rumble: [
    {
      id: "Alert-Rumble-manager",
      csVariant: "warning",
      dismissible: true,
      content:
        "RUMBLE does not support other mod managers. If you want to use a manager, you must use the RUMBLE Mod Manager, a manager specifically designed for this game.",
    },
  ],
  "wrestling-empire": [
    {
      id: "wrestling-empire-workshop",
      csVariant: "warning",
      dismissible: false,
      content:
        "Notice: Wrestling Empire is now using Steam Workshop for official mod support. This page is going to remain accessible, but it's likely the content is not going to be kept up to date.",
    },
  ],
  stacklands: [
    {
      id: "Alert-Stacklands-Workshop",
      csVariant: "warning",
      dismissible: true,
      content:
        "Stacklands now has official mod support. Thunderstore is no longer recommended for this game, and most mods can now be found on the Steam Workshop.",
    },
  ],
  "core-keeper": [
    {
      id: "core-keeper-modio",
      csVariant: "warning",
      dismissible: false,
      content: (
        <>
          Core Keeper is now using mod.io for their official mod support{" "}
          <NewLink
            primitiveType="link"
            href="https://steamcommunity.com/games/1621690/announcements/detail/6610777098295787201?snr=2_9_100003_"
            target="_blank"
            rel="noopener noreferrer"
            csVariant="primary"
          >
            Read more here
          </NewLink>
        </>
      ),
    },
  ],
  "pulsar-lost-colony": [
    {
      id: "pulsar-lost-colony-dev",
      csVariant: "warning",
      dismissible: false,
      content: (
        <>
          Thunderstore support for Pulsar: Lost Colony is still under
          development. For the time being, most mods are available through the{" "}
          <NewLink
            primitiveType="link"
            href="https://github.com/PULSAR-Modders/pulsar-mod-loader"
            target="_blank"
            rel="noopener noreferrer"
            csVariant="primary"
          >
            legacy mod loader
          </NewLink>{" "}
          and support can be found in the{" "}
          <NewLink
            primitiveType="link"
            href="https://discord.com/invite/j3Pydn6"
            target="_blank"
            rel="noopener noreferrer"
            csVariant="primary"
          >
            Pulsar Crew Matchup Server
          </NewLink>
        </>
      ),
    },
  ],
};

const NO_ALERTS: readonly CommunityAlertConfig[] = [];

// Own-property check (not `in` / bare indexing): community identifiers come
// from URLs, so an id colliding with an Object.prototype member (e.g.
// "constructor") must not resolve to an inherited value. Mirrors the guard in
// CommunityPromo/publicEnvVariables.
export function getCommunityAlerts(
  communityId?: string
): readonly CommunityAlertConfig[] {
  return communityId &&
    Object.prototype.hasOwnProperty.call(COMMUNITY_ALERTS, communityId)
    ? COMMUNITY_ALERTS[communityId]
    : NO_ALERTS;
}

interface CommunityAlertsProps {
  alerts: readonly CommunityAlertConfig[];
}

export function CommunityAlerts({ alerts }: CommunityAlertsProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="community-alerts">
      {alerts.map((alert) => (
        <NewAlert key={alert.id} csVariant={alert.csVariant}>
          {alert.content}
        </NewAlert>
      ))}
    </div>
  );
}
