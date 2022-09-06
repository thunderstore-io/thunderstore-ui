import styles from "./ModCard.module.css";

interface ModCard {
  name: string;
  owner: string;
  description: string;
  version: string;
  icon_url: string;
}

export const ModCard: React.FC<ModCard> = ({
  name,
  owner,
  description,
  version,
  icon_url,
}) => (
  <div className={styles.mod}>
    <div className={styles.column}>
      <img className={styles.imagePlaceholder} src={icon_url}></img>
    </div>
    <div className={styles.column}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.artifacts}>
        <div>{owner}</div>
        <div>{version}</div>
      </div>
    </div>
  </div>
);
