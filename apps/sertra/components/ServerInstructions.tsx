import pageStyles from "../styles/ServerDetail.module.css";
import styles from "./ServerInstructions.module.css";

export function ServerInstructions() {
  return (
    <section>
      <h2 className={pageStyles.sectionTitle}>How To Play</h2>
      <ol className={styles.instructions}>
        <li>
          Install{" "}
          <a href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager">
            <strong>Thunderstore Mod Manager</strong>
          </a>
        </li>
        <li>Click the join server button to launch the game</li>
        <li>Copy the connection information (IP and port)</li>
        <li>Use the information in-game to join the server</li>
        <li>Enjoy gaming on modded servers!</li>
      </ol>
    </section>
  );
}
