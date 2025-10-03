import "./Connection.css";
import { NewIcon, NewSwitch } from "@thunderstore/cyberstorm";
import { type OAuthConnection } from "@thunderstore/dapper/types";
import { type ReactElement } from "react";
import { type userLinkedAccountDisconnectProviders } from "../../../../../packages/thunderstore-api/src";

interface ConnectionProps {
  name: string;
  identifier: "discord" | "github" | "overwolf";
  icon: ReactElement;
  connection?: OAuthConnection;
  connectionLink: string;
  disconnectFunction: (data: userLinkedAccountDisconnectProviders) => void;
}

export function Connection(props: ConnectionProps) {
  const { connection, identifier, icon, name, connectionLink } = props;

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
