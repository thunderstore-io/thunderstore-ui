import Image from "next/image";
import styles from "./ModCard.module.css";

interface ModCard {
  name: string;
  owner: string | null;
  description: string | null;
  version_number: string | null;
  icon: string | null;
}

export const ModCard: React.FC<ModCard> = ({
  name,
  owner,
  description,
  version_number,
  icon,
}) => (
  <div className={styles.mod}>
    <div className={styles.column}>
      <Image
        src={icon ?? "/ts-logo.svg"}
        alt=""
        width={64}
        height={64}
        unoptimized={true}
      />
    </div>
    <div className={styles.column}>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.artifacts}>
        <div>{owner}</div>
        <div>{version_number}</div>
      </div>
    </div>
  </div>
);
