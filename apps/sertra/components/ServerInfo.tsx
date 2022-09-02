import { ServerListingDetailData } from "../api/models";
import pageStyles from "../styles/ServerDetail.module.css";
import { ServerMode, ServerPassword } from "./ListingAttributes";
import styles from "./ServerInfo.module.css";

export const ServerInfo: React.FC<ServerListingDetailData> = ({
  connection_data,
  is_pvp,
  mods,
  name,
  requires_password,
}) => (
  <section>
    <h2 className={pageStyles.sectionTitle}>Server Info</h2>
    <div>
      <div className={styles.row}>
        <div>Game</div>
        <div>V Rising</div>
      </div>
      <div className={styles.row}>
        <div>Server Name</div>
        <div>{name}</div>
      </div>
      <div className={styles.row}>
        <div>IP:Port</div>
        <div>{connection_data}</div>
      </div>
      <div className={styles.row}>
        <div>Mode</div>
        <div>
          <ServerMode isPvP={is_pvp} />
        </div>
      </div>
      <div className={styles.row}>
        <div>Mods</div>
        <div>{mods.length}</div>
      </div>
      <div className={styles.row}>
        <div>Password Protected</div>
        <div>
          <ServerPassword requiresPassword={requires_password} />
        </div>
      </div>
    </div>
  </section>
);
