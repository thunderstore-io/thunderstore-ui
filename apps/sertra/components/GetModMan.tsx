import styles from "./GetModMan.module.css";

export const GetModMan = () => {
  return (
    <button
      type="button"
      className={styles.getModManButton}
      onClick={(e) => {
        e.preventDefault();
        window.open(
          "https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager",
          "_blank"
        );
      }}
    >
      Get mod manager
    </button>
  );
};
