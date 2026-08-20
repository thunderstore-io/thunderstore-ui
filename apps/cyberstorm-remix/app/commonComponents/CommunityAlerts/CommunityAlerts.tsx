import { Suspense } from "react";
import { Await } from "react-router";

import { NewAlert } from "@thunderstore/cyberstorm";
import { type CommunityAlert } from "@thunderstore/dapper/types";

import "./CommunityAlerts.css";

export function CommunityAlerts({
  alerts,
}: {
  alerts: Promise<CommunityAlert[]> | CommunityAlert[];
}) {
  return (
    <div className="community-alerts">
      <Suspense fallback={null}>
        <Await resolve={alerts} errorElement={<></>}>
          {(resolvedAlerts) =>
            resolvedAlerts.map((alert) => (
              <NewAlert
                key={alert.id}
                csVariant={alert.variant}
                rootClasses="community-alerts__alert"
              >
                {alert.message}
              </NewAlert>
            ))
          }
        </Await>
      </Suspense>
    </div>
  );
}

CommunityAlerts.displayName = "CommunityAlerts";
