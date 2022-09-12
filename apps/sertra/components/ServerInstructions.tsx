import pageStyles from "../styles/ServerDetail.module.css";
import styles from "./ServerInstructions.module.css";

export const ServerInstructions: React.FC = () => (
  <section>
    <h2 className={pageStyles.sectionTitle}>How To Play</h2>
    <ol className={styles.instructions}>
      <li>
        Install Thunderstore{" "}
        <a href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager">
          Mod Manager
        </a>
      </li>
      <li>Click the join server button to launch Mod Manager</li>
      <li>Sync mods and launch the game in Mod manager</li>
      <li>Copy the connection address</li>
      <li>Use the address in-game to join the server</li>
      <li>Enjoy gaming on modded servers!</li>
    </ol>
  </section>
);
