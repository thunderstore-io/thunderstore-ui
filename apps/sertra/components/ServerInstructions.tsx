import pageStyles from "../styles/ServerDetail.module.css";
import styles from "./ServerInstructions.module.css";

export const ServerInstructions: React.FC = () => (
  <section>
    <h2 className={pageStyles.sectionTitle}>How To Play</h2>
    <ol className={styles.instructions}>
      <li>Click butan</li>
      <li>Öpens TMM</li>
      <li>Sync Mods</li>
      <li>Enjoy</li>
    </ol>
  </section>
);
