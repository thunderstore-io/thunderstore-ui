import { type ReactElement } from "react";

import { NewIcon, NewSwitch } from "@thunderstore/cyberstorm";
import { type OAuthConnection } from "@thunderstore/dapper";
import { type userLinkedAccountDisconnectProviders } from "@thunderstore/thunderstore-api";

import "./Connection.css";

interface ConnectionProps {
  name: string;
  identifier: "discord" | "github" | "overwolf";
  icon: ReactElement;
  connection?: OAuthConnection;
  connectionLink: string;
  disconnectFunction: (data: userLinkedAccountDisconnectProviders) => void;
  disabled: boolean;
}

export function Connection(props: ConnectionProps) {
  const { connection, identifier, icon, name, connectionLink, disabled } =
    props;

  return (
    <div className={`connection ${connection ? "" : "connection--disabled"}`}>
      <div className="connection__body">
        <NewIcon wrapperClasses="connection__icon">{icon}</NewIcon>
        <div className="connection__name">{name}</div>
      </div>
      <div className="connection__actions">
        {connection ? (
          <div className="connection__description">
            <span className="connection__connected">Connected as</span>
            <span className="connection__username">{connection.username}</span>
          </div>
        ) : null}
        <NewSwitch
          disabled={disabled}
          value={connection !== undefined}
          onChange={() => {
            if (connection) {
              props.disconnectFunction(identifier);
            } else {
              window.open(connectionLink);
            }
          }}
        />
      </div>
    </div>
  );
}

Connection.displayName = "Connection";
