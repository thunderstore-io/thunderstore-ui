import { type ReactNode } from "react";

import type { CommunityNotification } from "@thunderstore/thunderstore-api";

import { CyberstormLink } from "../../components/Links/Links";
import { Alert as NewAlert } from "../Alert/Alert";
import { Link as NewLink } from "../Link/Link";
import "./CommunityNotifications.css";

const VARIANT_MAP = {
  critical: "danger",
  warning: "warning",
  info: "info",
} as const;

// Shared design-system link styling so parsed links look the same whether they
// resolve to an internal (SPA) or external anchor.
const LINK_CLASSES = "link link--variant--cyber";

function isSafeInternalTarget(target: string): boolean {
  // Root-relative only. Reject protocol-relative "//host" which resolves to an
  // absolute URL.
  return target.startsWith("/") && !target.startsWith("//");
}

function isSafeExternalTarget(target: string): boolean {
  const normalized = target.trim().toLowerCase();
  return normalized.startsWith("http://") || normalized.startsWith("https://");
}

function renderLink(label: string, target: string, key: number): ReactNode {
  const text = label.length > 0 ? label : target;
  const trimmedTarget = target.trim();

  if (isSafeInternalTarget(trimmedTarget)) {
    return (
      <CyberstormLink
        key={key}
        linkId="Anonymous"
        url={trimmedTarget}
        className={LINK_CLASSES}
      >
        {text}
      </CyberstormLink>
    );
  }

  if (isSafeExternalTarget(trimmedTarget)) {
    return (
      <NewLink
        key={key}
        primitiveType="link"
        href={trimmedTarget}
        target="_blank"
        rel="noopener noreferrer"
        csVariant="cyber"
      >
        {text}
      </NewLink>
    );
  }

  // Unsafe/unsupported target: render the original markup as plain text. This
  // is a defense-in-depth layer on top of the backend sanitization so a
  // dangerous target can never become a live link.
  return `[${label}](${target})`;
}

/**
 * Parses the minimalistic [label](target) link syntax out of otherwise
 * plain-text notification content into React nodes. Targets are matched with
 * balanced parentheses to mirror the backend validator.
 */
function parseNotificationContent(content: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let buffer = "";
  let index = 0;
  let key = 0;

  const flushBuffer = () => {
    if (buffer.length > 0) {
      nodes.push(buffer);
      buffer = "";
    }
  };

  while (index < content.length) {
    if (content[index] === "[") {
      const labelEnd = content.indexOf("]", index + 1);
      if (labelEnd !== -1 && content[labelEnd + 1] === "(") {
        // Read the target with balanced parentheses.
        let depth = 1;
        let cursor = labelEnd + 2;
        while (cursor < content.length && depth > 0) {
          const char = content[cursor];
          if (char === "(") {
            depth += 1;
          } else if (char === ")") {
            depth -= 1;
            if (depth === 0) break;
          }
          cursor += 1;
        }

        if (depth === 0) {
          const label = content.slice(index + 1, labelEnd);
          const target = content.slice(labelEnd + 2, cursor);
          flushBuffer();
          nodes.push(renderLink(label, target, key));
          key += 1;
          index = cursor + 1;
          continue;
        }
      }
    }

    buffer += content[index];
    index += 1;
  }

  flushBuffer();
  return nodes;
}

export interface CommunityNotificationsProps {
  notifications?: CommunityNotification[];
}

export function CommunityNotifications(props: CommunityNotificationsProps) {
  const { notifications } = props;

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="community-notifications">
      {notifications.map((notification, index) => (
        <NewAlert key={index} csVariant={VARIANT_MAP[notification.type]}>
          {parseNotificationContent(notification.content)}
        </NewAlert>
      ))}
    </div>
  );
}
