import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GetModMan } from "./buttons/GetModMan";
import styles from "./LaunchingModManPopup.module.css";

interface JoinServerProps {
  togglePopup: () => void;
}

export const LaunchingModManPopup: React.FC<JoinServerProps> = ({
  togglePopup,
}) => {
  return (
    <div className={styles.background}>
      <section className={styles.popUp}>
        <div className={styles.header}>
          <h2>Launching Mod Manager...</h2>
          <button className={styles.closeWindow} onClick={togglePopup}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className={styles.content}>
          <ol className={styles.instructions}>
            <li>Launch Mod Manager</li>
            <li>Sync mods for selected server</li>
            <li>Copy the connection address</li>
            <li>Launch the game through Mod Manager</li>
            <li>Use the address in-game to join the server</li>
          </ol>
        </div>
        <div className={styles.footer}>
          <span className={styles.footerLeft}>
            Don&apos;t have Thunderstore Mod Manager yet?
          </span>
          {<GetModMan />}
        </div>
      </section>
    </div>
  );
};
