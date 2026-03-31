import { NewAlert, type NewAlertProps } from "@thunderstore/cyberstorm";

import "./TabFetchState.css";

interface Props {
  message: React.ReactNode;
  variant?: NewAlertProps["csVariant"];
}

export function TabFetchState({ message, variant = "info" }: Props) {
  return (
    <div className="tab-fetch-state">
      <NewAlert csVariant={variant}>{message}</NewAlert>
    </div>
  );
}

TabFetchState.displayName = "TabFetchState";
