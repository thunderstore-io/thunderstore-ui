import { PropsWithChildren } from "react";
import styles from "./ServerList.module.css";

interface ServerModeProps {
  isPvP: boolean;
}
export const ServerMode: React.FC<PropsWithChildren<ServerModeProps>> = ({
  isPvP,
}) => {
  if (isPvP) {
    return <div className={styles.pvp}>PvP</div>;
  } else {
    return <div className={styles.pve}>PvE</div>;
  }
};

interface ServerPasswordProps {
  requiresPassword: boolean;
}
export const ServerPassword: React.FC<PropsWithChildren<ServerPasswordProps>> =
  ({ requiresPassword }) => <div>{requiresPassword ? "🔒" : ""}</div>;
