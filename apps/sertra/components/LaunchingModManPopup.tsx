import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GetModMan } from "./buttons/GetModMan";
import styles from "./LaunchingModManPopup.module.css";

interface JoinServerProps {
  togglePopup: () => void;
}

export function LaunchingModManPopup({ togglePopup }: JoinServerProps) {
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
            <li>
              Both Thunderstore Mod Manager and the game should now launch
              automatically
            </li>
            <li>Copy the connection information (IP and port)</li>
            <li>
              When the game launches, use the information in-game to join the
              server
            </li>
            <li>Enjoy gaming on modded servers!</li>
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
}
