import Image, { ImageLoader } from "next/image";
import styles from "./ModCard.module.css";

interface ModCard {
  name: string;
  owner: string | null;
  description: string | null;
  version: string | null;
  icon_url: string | null;
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
      <Image
        src={icon_url ?? "/ts-logo.svg"}
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
        <div>{version}</div>
      </div>
    </div>
  </div>
);
