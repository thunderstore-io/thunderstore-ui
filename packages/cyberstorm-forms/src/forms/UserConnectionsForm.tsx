import styles from "./UserConnectionsForm.module.css";
import { userLinkedAccountDisconnect } from "@thunderstore/thunderstore-api";
import {
  useApiForm,
  userLinkedAccountDisconnectFormSchema,
} from "@thunderstore/ts-api-react-forms";

// import { Switch } from "@thunderstore/cyberstorm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currentUserSchema } from "@thunderstore/dapper-ts";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { OverwolfLogo } from "@thunderstore/cyberstorm/src/svg/svg";
import { OAuthConnection } from "@thunderstore/dapper/types";
import { Icon } from "@thunderstore/cyberstorm/src/components/Icon/Icon";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { Button } from "@thunderstore/cyberstorm";
import { useToast } from "@thunderstore/cyberstorm/src/components/Toast/Provider";

type ProvidersType = {
  name: "discord" | "github" | "overwolf";
  icon: JSX.Element;
}[];

const PROVIDERS: ProvidersType = [
  { name: "discord", icon: <FontAwesomeIcon icon={faDiscord} /> },
  { name: "github", icon: <FontAwesomeIcon icon={faGithub} /> },
  { name: "overwolf", icon: OverwolfLogo() },
];

export function UserConnectionsForm(props: {
  currentUser: typeof currentUserSchema._type;
  connectionLinks: {
    discord: string;
    github: string;
    overwolf: string;
  };
}) {
  const toast = useToast();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitSuccess = (_r: unknown) => {
    toast.addToast({
      variant: "success",
      message: `User ${props.currentUser.username} was disconnected from TODO`,
      duration: 30000,
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmitError = (_e: unknown) => {
    toast.addToast({
      variant: "danger",
      message: "Unknown error occurred. The error has been logged",
    });
  };

  const { submitHandler } = useApiForm({
    schema: userLinkedAccountDisconnectFormSchema,
    meta: {},
    endpoint: userLinkedAccountDisconnect,
  });

  const onSubmit = async (
    data: typeof userLinkedAccountDisconnectFormSchema._type
  ) => {
    try {
      const result = await submitHandler(data);
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
    } catch (e) {
      if (onSubmitError) {
        onSubmitError(e);
      } else {
        throw e;
      }
    }
  };

  return (
    <div className={styles.connectionList}>
      {PROVIDERS.map((p) => (
        <Connection
          key={p.name}
          provider={p}
          connection={props.currentUser.connections?.find(
            (c) => c.provider.toLowerCase() === p.name
          )}
          connectionLink={
            p.name === "discord"
              ? props.connectionLinks.discord
              : p.name === "github"
              ? props.connectionLinks.github
              : props.connectionLinks.overwolf
          }
          disconnectFunction={onSubmit}
        />
      ))}
    </div>
  );
}

UserConnectionsForm.displayName = "UserConnectionsForm";

interface ConnectionProps {
  // eslint-disable-next-line prettier/prettier
  provider: typeof PROVIDERS[number];
  connection?: OAuthConnection;
  connectionLink: string;
  disconnectFunction: (
    data: typeof userLinkedAccountDisconnectFormSchema._type
  ) => void;
}

function Connection(props: ConnectionProps) {
  const { connection, provider, connectionLink } = props;

  return (
    <div
      className={classnames(
        styles.itemWrapper,
        connection ? styles.enabled : styles.disabled
      )}
    >
      <div className={styles.item}>
        <div className={styles.connectionTypeInfo}>
          <Icon wrapperClasses={styles.connectionTypeInfoIcon}>
            {provider.icon}
          </Icon>
          <div className={styles.connectionTypeInfoName}>
            {provider.name === "discord"
              ? "Discord"
              : provider.name === "github"
              ? "Github"
              : "Overwolf"}
          </div>
        </div>
        <div className={styles.rightSection}>
          {connection ? (
            <div className={styles.connectedAs}>
              <div className={styles.connectedAsDescription}>Connected as</div>
              <div className={styles.connectedAsUsername}>
                {connection.username}
              </div>
            </div>
          ) : null}
          {connection ? (
            <Button.Root
              paddingSize="large"
              colorScheme="danger"
              onClick={() =>
                props.disconnectFunction({ provider: props.provider.name })
              }
            >
              Disconnect
            </Button.Root>
          ) : (
            <Button.Root
              paddingSize="large"
              colorScheme="specialGreen"
              href={connectionLink}
            >
              Connect
            </Button.Root>
          )}
          {/* <Switch value={connection !== undefined} /> */}
        </div>
      </div>
    </div>
  );
}

Connection.displayName = "ConnectionsItem";
