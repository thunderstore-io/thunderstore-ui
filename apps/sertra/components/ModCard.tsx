import styles from "./ModCard.module.css";

interface ModCard {
  name: string;
  description: string;
}

export const ModCard: React.FC<ModCard> = ({ name, description }) => (
  <div className={styles.mod}>
    <div className={styles.column}>
      <div className={styles.imagePlaceholder}></div>
    </div>
    <div className={styles.column}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.artifacts}>
        <div>Artifacts</div>
        <div>Artifacts</div>
        <div>Artifacts</div>
      </div>
    </div>
  </div>
);
