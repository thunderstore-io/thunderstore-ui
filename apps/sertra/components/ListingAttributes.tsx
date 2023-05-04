import { PropsWithChildren } from "react";

import styles from "./ServerList.module.css";

interface ServerModeProps {
  isPvP: boolean;
}
export function ServerMode({ isPvP }: ServerModeProps) {
  if (isPvP) {
    return <div className={styles.pvp}>PvP</div>;
  } else {
    return <div className={styles.pve}>PvE</div>;
  }
}

interface ServerPasswordProps {
  requiresPassword: boolean;
}
export function ServerPassword({
  requiresPassword,
}: PropsWithChildren<ServerPasswordProps>) {
  return <div>{requiresPassword ? "🔒" : ""}</div>;
}
