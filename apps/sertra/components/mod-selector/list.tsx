import styles from "./list.module.css";
import { IconButton } from "./iconButton";
import { ModPackage } from "./data";

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.rowIcon}
          alt="mod icon"
          src={iconUrl}
        />
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
  onDelete?: () => void;
}
export const ModRowControls: React.FC<ModRowControlsProps> = ({
  versionNumbers,
  onDelete,
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
        <IconButton content={"🗑"} buttonProps={{ onClick: onDelete }} />
      </div>
    </>
  );
};

export interface ModListEntryProps {
  modPackage: ModPackage;
  showControls?: boolean;
  onDelete?: (selection: ModPackage) => void;
}
export const ModListRow: React.FC<ModListEntryProps> = ({
  modPackage,
  showControls,
  onDelete,
}) => {
  return (
    <div className={styles.row}>
      <ModRowInfo
        iconUrl={modPackage.iconUrl}
        packageName={modPackage.packageName}
        ownerName={modPackage.ownerName}
      />
      {showControls && (
        <ModRowControls
          versionNumbers={modPackage.versionNumbers}
          onDelete={() => onDelete && onDelete(modPackage)}
        />
      )}
    </div>
  );
};
