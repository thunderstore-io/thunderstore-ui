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
        connection ? "" : "nimbus-commonComponents-connection--disabled"
      }`}
    >
      <div className="nimbus-commonComponents-connection-body">
        <NewIcon wrapperClasses="nimbus-commonComponents-connection-body__icon">
          {icon}
        </NewIcon>
        <div className="nimbus-commonComponents-connection-body__name">
          {name}
        </div>
      </div>
      <div className="nimbus-commonComponents-connection-actions">
        {connection ? (
          <div className="nimbus-commonComponents-connection-description">
            <span className="nimbus-commonComponents-connection-description__connected">
              Connected as
            </span>
            <span className="nimbus-commonComponents-connection-description__username">
              {connection.username}
            </span>
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
