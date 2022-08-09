import styles from "./list.module.css";
import { IconButton } from "./iconButton";

export interface ModRowInfoProps {
  iconUrl: string;
  packageName: string;
  ownerName: string;
}
export const ModRowInfo: React.FC<ModRowInfoProps> = ({
  iconUrl,
  packageName,
  ownerName,
}) => {
  return (
    <>
      <div className={styles.colSmall}>
        <img className={styles.rowIcon} alt="mod icon" src={iconUrl} />
      </div>
      <div className={styles.colLarge}>
        <span className={styles.packageName}>{packageName}</span>
        <span className={styles.ownerName}>by {ownerName}</span>
      </div>
    </>
  );
};

export interface ModRowControlsProps {
  versionNumbers: string[];
}
export const ModRowControls: React.FC<ModRowControlsProps> = ({
  versionNumbers,
}) => {
  return (
    <>
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
    </>
  );
};

export interface ModListEntryProps {
  iconUrl: string;
  packageName: string;
  ownerName: string;
  versionNumbers: string[];
  showControls?: boolean;
}
export const ModListRow: React.FC<ModListEntryProps> = ({
  iconUrl,
  packageName,
  ownerName,
  versionNumbers,
  showControls,
}) => {
  return (
    <div className={styles.row}>
      <ModRowInfo
        iconUrl={iconUrl}
        packageName={packageName}
        ownerName={ownerName}
      />
      {showControls && <ModRowControls versionNumbers={versionNumbers} />}
    </div>
  );
};
