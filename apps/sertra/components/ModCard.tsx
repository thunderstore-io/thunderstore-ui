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
      {icon_url ? (
        <img className={styles.imageIcon} src={icon_url}></img>
      ) : (
        <img className={styles.imageIcon} src="/favicon.ico"></img>
      )}
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
