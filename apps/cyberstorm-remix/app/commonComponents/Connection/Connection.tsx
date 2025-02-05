import "./Connection.css";
import { NewIcon, NewButton } from "@thunderstore/cyberstorm";
import { OAuthConnection } from "@thunderstore/dapper/types";
import { userLinkedAccountDisconnectFormSchema } from "@thunderstore/ts-api-react-forms";

interface ConnectionProps {
  name: string;
  identifier: "discord" | "github" | "overwolf";
  icon: JSX.Element;
  connection?: OAuthConnection;
  connectionLink: string;
  disconnectFunction: (
    data: typeof userLinkedAccountDisconnectFormSchema._type
  ) => void;
}

export function Connection(props: ConnectionProps) {
  const { connection, identifier, icon, name, connectionLink } = props;

  return (
    <div
      className={`nimbus-commonComponents-connection ${
        connection ? "" : "--disabled"
      }`}
    >
      <div className="__body">
        <NewIcon wrapperClasses="__icon">{icon}</NewIcon>
        <div className="__name">{name}</div>
      </div>
      <div className="__actions">
        {connection ? (
          <div className="__description">
            <span className="__connected">Connected as</span>
            <span className="__username">{connection.username}</span>
          </div>
        ) : null}
        {connection ? (
          <NewButton
            csVariant="danger"
            onClick={() => props.disconnectFunction({ provider: identifier })}
          >
            Disconnect
          </NewButton>
        ) : (
          <NewButton csVariant="success" href={connectionLink}>
            Connect
          </NewButton>
        )}
        {/* <Switch value={connection !== undefined} /> */}
      </div>
    </div>
  );
}

Connection.displayName = "Connection";
