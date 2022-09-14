import { GetModMan } from "./GetModMan";
import styles from "./LaunchingModManPopup.module.css";

interface JoinServerProps {
  setClose: () => void;
}

export const LaunchingModManPopup: React.FC<JoinServerProps> = ({
  setClose,
}) => {
  return (
    <div className={styles.background}>
      <section className={styles.popUp}>
        <section className={styles.header}>
          <h2>Launching Mod Manager...</h2>
          <button className={styles.closeWindow} onClick={setClose}>
            X
          </button>
        </section>
        <ol className={styles.instructions}>
          <li>Launch Mod Manager</li>
          <li>Sync mods for selected server</li>
          <li>Copy the connection address</li>
          <li>Launch the game through Mod Manager</li>
          <li>Use the address in-game to join the server</li>
        </ol>
        <section className={styles.footer}>
          <span className={styles.footerLeft}>
            Don&apos;t have Thunderstore Mod Manager yet?
          </span>
          <div className={styles.footerRight}>{<GetModMan />}</div>
        </section>
      </section>
    </div>
  );
};
