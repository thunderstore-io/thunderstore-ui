import styles from "./GetModMan.module.css";

export const GetModMan = () => (
  <button
    type="button"
    className={styles.button}
    onClick={(e) => {
      e.preventDefault();
      window.open(
        "https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager",
        "_blank",
        "noopener,noreferrer"
      );
    }}
  >
    Get mod manager
  </button>
);
