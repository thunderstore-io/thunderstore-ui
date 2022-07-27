import styles from "./list.module.css";
import { IconButton } from "./iconButton";

export interface ModListEntryProps {
  iconUrl: string;
  packageName: string;
  ownerName: string;
  versionNumbers: string[];
}
export const ModListRow: React.FC<ModListEntryProps> = ({
  iconUrl,
  packageName,
  ownerName,
  versionNumbers,
}) => {
  return (
    <div className={styles.row}>
      <div className={styles.colSmall}>
        <img className={styles.rowIcon} alt="mod icon" src={iconUrl} />
      </div>
      <div className={styles.colLarge}>
        <span className={styles.packageName}>{packageName}</span>
        <span className={styles.ownerName}>by {ownerName}</span>
      </div>
      <div className={styles.colSmall}>
        <div className={styles.selectWrapper}>
          <select className={styles.versionSelect}>
            {versionNumbers.map((vernum) => {
              return (
                <option key={vernum} value={vernum}>
                  {vernum}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className={styles.colSmall}>
        <IconButton content={"🗑"} />
      </div>
    </div>
  );
};
